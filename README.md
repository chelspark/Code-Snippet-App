# Code Snippet App

## 1. Application Outline

The application we aimed to build is a code snippet application designed to help developers write, edit, and share their code snippets efficiently and enhance the coding workflow by offering personalised and interactive features such as code completion, snippet sharing, and real-time code editing.

**Target Users**: Our target users are developers, designers, and students who work with code snippets of different programming languages. 

**Data Sources**:

- **MongoDB database** to store user data, code snippets, and favourites. This structure supports user profiles, links to social media, snippet visibility settings for snippet creation and updates.
- **User Input** for code snippets including titles, descriptions, programming languages, and full code text, as well as user profile settings like visibility preferences and social links.
- **Profile Image storage** to handle user profile images, allowing customisation of user profiles and enhanced personalisation.

**Technologies**

- **Node.js**: Backend framework
- **Express**: Web server
- **React**: Templating engine for rendering dynamic HTML
- **CSS/Material UI**: styling for appearance of the frontend components and overall layout
- **JavaScript**: For handling front-end logic

## 2. MVP Implementation

For our MVP, we implemented the following milestones:

1. **Planned Milestones**:

    - **User Authentication**: Implemented secure login and registration functionality using JWT, allowing users to create accounts and write their code snippets.
    - **Code Snippet Management**: Users can create, edit, and delete their code snippets.
    
2. **Additional Implementation**:

    - **Public and Private Profile Modes**: Users can make their profiles visible to the public.
    - **Profile Sharing**: Users can share their profiles with others if their profiles are on public mode.
    - **User Favourites**: Users can mark favourites on any code snippets.
    - **Social Media Sharing**: Users can share their social media profiles.

## 3. Guide to the Project Source Code

- **Root Directory**
    - /dist/main.js: The entry point for the application, which initialises the server and loads the core configurations.
- **/middleware**
    - /verifyToken.js and /authenticateToken.js: Verify user tokens for secure access to protected routes.
    - /upload.js and /cropImage.js: Manage file uploads and image cropping, used primarily for handling user profile images.
- **/public**
    - /index.html: The main HTML file served by the application, acting as the base for frontend content.
    - /bundle.js: Bundled JavaScript file containing the compiled frontend code.
- **/src/routers**
    - /loginRouter.js and /registerRouter.js: Manage user authentication, including login and registration.
    - /profileRouter.js: Routes for profile-related actions, such as viewing and updating user profiles, setting profile visibility, and adding or deleting favourites.
    - /snippetsRouter.js: Routes for managing code snippets, including creation, updating, and retrieval.
- **/src**
    - /model: Data models for snippet and user, using Mongoose schema for MongoDB.
    - /styles: Contains styling files for the appearance of the frontend components and overall layout.
    - Components: Contains all react components that build the frontend user interface.
        - /app.js: The main application component that serves as the root of the app. It sets up the structure and renders other components based on the routes.
        - /login.js and /register.js: Handles user login and registration functionality on the frontend.
        - /layout.js: Defines the overall layout structure of the application, such as header and footer.
        - /NotFound.js: A component that serves as a 404 error page, displayed when users attempt to access a route that doesn’t exist.
        - /PrivateRoute.js: A higher-order component that wraps around private routes, allowing only authenticated users to access these routes. If a user is not authenticated, it redirects them to the login page.
        - /profile.js: Displays the user’s profile information, including personal details, profile image, and social media links.
        - /profileEdit.js: Provides an interface for users to edit their profile information. This includes fields to update their username, social links, image, and profile visibility settings.
        - /profileFavourites.js: A component that displays the user’s favourite snippets.
        - /snippets.js: This component allows users to create, edit, and view their snippets.
        - /publicProfile.js: Displays a public version of the user’s profile that other users can view. This page only shows when their profile is on public mode.
        - /index.js: The entry point for rendering the React application into the DOM.
        - /home.js: The main page displayed when users enter the application. It shows all public code snippets and has options to filter by preferred languages.
        - /AuthGuard.js: A component that acts as a guard for login and registration pages to block logged-in users from entering.

## 4. Next Steps

If we were to continue the project, our next steps would include:

- **Snippet Sharing**: Allow users to share snippets via a unique link.
- **Code Completion and Syntax Highlighting**: Implement code completion using open-source libraries.
- **AI Integration (Google Gemini)**: Integrate with an external AI service.
- **Extensive Theme Customisation**: Allow users to choose between light and dark modes or customise themes.
- **Multi-Language Support**: Full code completion support for multiple languages.
- **In Browser Code Running**: Allow users to execute their code snippets.
- **Interactive Editing**: Allow users to edit their snippets live within the app with real-time updates.

## 5. Team Contributions and Project Management

For project management, we used:

- **Discord** for daily communication
- **Trello** for task assignment and updates

Team Contributions:

- **Chaeah**: Main role - Developed the user interface for the profile page, including features such as profile sharing, social media integration, managing public and private profile modes, and editing profiles with image upload and cropping functionality. Additionally, contributed to the implementation of the user favourites feature, set up the authentication flow and developed the login and registration functionality by connecting to MongoDB and creating backend logic for account creation and credential verification using JWT.

- **Ian**: Created main app template (all pages) for team to work from, created snippets page form that allows users to create code snippets. Implemented code syntax highlighting on the code snippets page form that highlights the code syntax the user types depending on the language set. Implemented the edit submitted code snippets functionality so users can edit snippets they have saved to the database. Implemented code snippet delete functionality. Implemented code snippet copy to clipboard functionality. Implemented  register page password complexity feature. Responsible for creation and styling of React pages.

- **Luke**: Setup and maintained project management tools (Trello, etc.), created charts for weekly standup meetings (burndown and gantt), and prepared demos for the weekly standups. Also implemented the main page filter option, reimplemented broken syntax highlighting, and other miscellaneous tweaks and bugfixes. Deployed application to Google Compute Engine for both the live demo and final submission (see origin/refactor).

## 6. Testing Credentials

- **Email**: t1@t1.com
- **Password**: 123

You can register a new user to demonstrate the password complexity feature.
