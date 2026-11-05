import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function validText(value: unknown, max = 500) {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= max;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (!["GET", "POST"].includes(req.method)) {
    return json({ error: "Method not allowed" }, 405);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");

  if (!url || !key) {
    return json({ error: "Server configuration missing" }, 500);
  }

  const authHeader = req.headers.get("Authorization");

  const supabase = createClient(url, key, {
    global: {
      headers: authHeader
        ? { Authorization: authHeader }
        : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    // GET: public property listings
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id,title,address,price,bedrooms,bathrooms,image_url,image_alt,listing_url,created_at"
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        return json({ error: "Unable to load properties" }, 500);
      }

      return json({ properties: data });
    }

    // POST: authenticated property creation
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Authentication required" }, 401);
    }

    const token = authHeader.slice(7);

    const { data: authData, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return json({ error: "Invalid authentication" }, 401);
    }

    const raw = await req.text();

    if (raw.length > 10000) {
      return json({ error: "Request is too large" }, 413);
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = JSON.parse(raw);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        return json({ error: "Invalid request body" }, 400);
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const {
      title, address, price, bedrooms, bathrooms,
      image_url, image_alt, listing_url,
    } = body;

    if (
      !validText(title, 200) ||
      !validText(address, 500) ||
      !validText(image_alt, 500) ||
      !validText(image_url, 2000) ||
      !validText(listing_url, 2000) ||
      typeof price !== "number" ||
      !Number.isFinite(price) || price < 0 ||
      !Number.isInteger(bedrooms) || bedrooms < 0 ||
      typeof bathrooms !== "number" ||
      !Number.isFinite(bathrooms) ||
      bathrooms < 0 || bathrooms > 99.9 ||
      !Number.isInteger(bathrooms * 10)
    ) {
      return json({ error: "Invalid property data" }, 400);
    }

    for (const value of [image_url, listing_url]) {
      try {
        const parsed = new URL(value as string);
        if (!["https:", "http:"].includes(parsed.protocol)) {
          return json({ error: "Invalid URL" }, 400);
        }
      } catch {
        return json({ error: "Invalid URL" }, 400);
      }
    }

    const { data, error } = await supabase
      .from("properties")
      .insert({
        user_id: authData.user.id,
        title: (title as string).trim(),
        address: (address as string).trim(),
        price,
        bedrooms,
        bathrooms,
        image_url,
        image_alt,
        listing_url,
      })
      .select()
      .single();

    if (error) {
      return json({ error: "Unable to create property" }, 400);
    }

    return json({ property: data }, 201);
  } catch (error) {
    console.error("Property API error", error);
    return json({ error: "Internal server error" }, 500);
  }
});
