# Chat Application

This is a feature-rich chat application built using ReactJS, JSX, and Firebase. Users can Hop in by creating a new account or login and enjoy real-time messaging with other users.

## Demo

Check out the [Live Demo](https://chatapp-ed6f0.web.app/) to see the chat application in action.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [How to Create and Use a Bash Script](#how-to-create-and-use-a-bash-script)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- **Account Management**
  - Create an account.
  - Log in with existing accounts.
  - Update bio and profile picture.
  - Logout functionality.

- **Messaging**
  - Real-time messaging with emojis and photos.
  - Notifications for new messages (blue glow indicator).
  - View all shared photos in a dedicated section.

- **User Interactions**
  - Search for other users.
  - Block users, restricting them from viewing profile details or sending messages.

## Tech Stack

- **Frontend**: ReactJS, JSX
- **Backend**: Firebase
- **CSS**: Scss Liabrary
- **Notification**: React-toastify Liabrary
- **Zustand** to create store

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RogueSandy/Chat-App.git
   cd chat-app
2. **Install dependencies**
   ```bash
   npm install
3. **Configure Firebase**
   - Go to [Firebase Consoel](https://console.firebase.google.com/)
   - Create a new project or use an existing project.
   - Add your app to the project to get the Firebase configuration.
   - Copy the Firebase configuration and replace the firebaseConfig object inside the src/lib/firebase.js file.
4. **Run the application**
   ```bash
   npm run dev

## Usage

1. **Create an Accoutn**
  - Sign up with your email and password.
  - Update your bio and profile picture after logging in.
2. **Messaging**
  - Search for other users and start chatting.
  - Send emojis and photos along with your messages.
  - View all shared photos in the dedicated photos section.
3. **Blocking Users**
  - Block any user by clicking the red block button.
  - Blocked users cannot see your username or profile picture and cannot send messages.

## Known Issues
 - Photo Messaging: You must send a message with a photo; you can't send a photo alone.
 - Video and Voice Calling: Currently, there are no video or voice calling features.
 - Chat History: Previous chat history is sometimes visible when logging in with a different ID.
 - File Sending: There is no feature to send files.
 - Theme Changes: There are no theme change options.
 - Chat Settings: There are no chat settings available.
 - Responsiveness: Only responsive for Moniter screen.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes that you may find or from the listed above.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements
Special thanks to the React and Firebase teams for their amazing tools and documentation.




