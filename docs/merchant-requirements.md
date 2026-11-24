# Local Merchant Services & Appointment Booking — Requirements

## Objective
Allow local merchants to publish services and manage appointment availability while enabling customers to discover services and request bookings securely.

## User Stories and Acceptance Criteria

### US-01: Merchant Service Management
As a merchant, I want to create and manage service listings so customers can discover my offerings.

Acceptance Criteria:
- Given an authenticated merchant, when valid service information is submitted, then a service is created under that merchant.
- Given a merchant attempts to edit another merchant's service, then access is denied.
- Given invalid service information, then validation prevents saving.

### US-02: Service Discovery
As a customer, I want to browse available merchant services so I can find a suitable service.

Acceptance Criteria:
- Given published services, when a visitor opens the service directory, then the services are displayed.
- Given an unpublished service, when an anonymous visitor browses the directory, then that service is not displayed.

### US-03: Appointment Booking
As a customer, I want to book an available appointment so I can reserve a service.

Acceptance Criteria:
- Given an authenticated customer and an available time slot, when a valid booking request is submitted, then the appointment is recorded.
- Given a slot is already reserved, when another customer attempts to book it, then the conflicting request is rejected.
- Given an invalid booking request, then validation rejects the request.

### US-04: Appointment Privacy
As a customer, I want my booking details protected so unauthorized users cannot view or modify them.

Acceptance Criteria:
- Customers can view their own appointments.
- Merchants can view appointments for their services.
- Unauthorized users cannot view or alter private appointments.

### US-05: Accessible Booking Interface
As a visitor, I want accessible service information and booking controls so I can use the platform with assistive technology.

Acceptance Criteria:
- Form fields have visible labels and associated accessible names.
- The booking interface supports keyboard navigation.
- Validation errors are communicated using text and accessible messaging.
- The layout supports mobile and desktop screen sizes.

## Traceability Matrix
| Requirement | User Story | Implementation Target | Verification |
| --- | --- | --- | --- |
| REQ-01 | US-01 | Merchant/service tables, RLS, form | Valid and unauthorized write tests |
| REQ-02 | US-02 | Service directory, publication policy | Public and unpublished listing tests |
| REQ-03 | US-03 | Availability and appointment tables, booking flow | Successful and conflicting booking tests |
| REQ-04 | US-04 | Appointment RLS policies | Customer, merchant, and unauthorized access tests |
| REQ-05 | US-05 | Semantic React booking components | Keyboard, label, error, and responsive checks |

## Verification Status
All requirements are proposed and pending implementation and verification. No test outcomes are claimed in this document.

## AI-Assisted Development
AI assisted with drafting initial user stories and acceptance criteria. The student is responsible for reviewing requirements, implementing functionality, running tests, and recording verified results.
