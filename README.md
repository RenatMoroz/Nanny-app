👶 Nanny Services Pet-Project

Nanny Services is a web application for searching and booking nanny services. It allows users to browse nanny cards, add them to favorites, and navigate to a page to schedule an appointment.

📌 Main Features

Home page with the site title, company slogan, and a link that redirects to the Nannies page.
Nannies page with nanny cards, which can be:
sorted alphabetically, by price, or by rating
filtered by price and other characteristics
loaded in additional batches via the Load more button
Favorites — a private page showing the nannies added to favorites by the user
Nanny cards display key information: name, age (calculated from date of birth), experience, rating, price, location, characteristics, and description
Read more button expands additional information and reviews
Make an appointment button opens a separate page with a form to schedule a meeting
User authentication is implemented via a custom backend (registration, login, logout, fetching current user)
Favorites state persists when the page is refreshed

🧰 Tech Stack

Frontend: Next.js | TypeScript | CSS Modules | Axios | Zustand | React Hook Form | Yup | React Hot Toast
Backend: Node.js | Express (deployed on Amazon)
Database: MongoDB (accessed through backend API)

💻 Features / My Contribution

Fully developed the frontend using Next.js and TypeScript
Implemented dynamic nanny cards with filtering, sorting, and pagination
Added favorites functionality
Created a separate page for appointment scheduling
Connected frontend with custom backend hosted on Amazon
Ensured persistence of user actions (favorites, forms)
Implemented responsive design for mobile, tablet, and desktop

🚀 Demo

[Nanny Services Live Page](https://nanny-app-hazel.vercel.app)

[Backend Nannys-services](https://github.com/RenatMoroz/Nanny-Sevices-backend)
