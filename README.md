# Backend and Frontend Template

Latest version: https://git.chalmers.se/courses/dit342/group-00-web

This template refers to itself as `group-00-web`. In your project, use your group number in place of `00`.

## Project Structure

| File                                                 | Purpose                     | What you do?                             |
| ---------------------------------------------------- | --------------------------- | ---------------------------------------- |
| `server/`                                            | Backend server code         | All your server code                     |
| [server/README.md](server/README.md)                 | Everything about the server | **READ ME** carefully!                   |
| `client/`                                            | Frontend client code        | All your client code                     |
| [client/README.md](client/README.md)                 | Everything about the client | **READ ME** carefully!                   |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

- [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  - [Add your Git username and set your email](https://docs.gitlab.com/ce/gitlab-basics/start-using-git.html#add-your-git-username-and-set-your-email)
    - `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    - `git config --global user.email "email@example.com"` => check `git config --global user.email`
  - > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
- [Chalmers GitLab](https://git.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  - DIT342 course group: https://git.chalmers.se/courses/dit342
  - [Setup SSH key with Gitlab](https://docs.gitlab.com/ee/ssh/)
    - Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    - Add your public SSH key to your Gitlab profile under https://git.chalmers.se/profile/keys
    - Make sure the email you use to commit is registered under https://git.chalmers.se/profile/emails
  - Checkout the [Backend-Frontend](https://git.chalmers.se/courses/dit342/group-00-web) template `git clone git@git.chalmers.se:courses/dit342/group-00-web.git`
- [Server Requirements](./server/README.md#Requirements)
- [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-00-web.git

# Change into the directory
cd group-00-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

2-5 sentences describing what the system does

### Pages

- Home: 1-3 sentences describing what the page displays and what a user can do
- Shopping cart: ...

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/er_diagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)

A few sentences
In the diagram we have defined the user. The user has an ID, username, email, password and a profile picture. The user has a list of predefined exercises that they can add to their workout regiment. The user will also have the choice to add their own exercises if they are not already listed. Each exercise has their own ID, name, a boolean that tells if the user uses weights or not for the exercise, how many reps and how many sets the user performs, which body part the exercise targets, and a boolean that tells whether the user has added the exercise themselves or if it's a predefined exercise.

Each desired exercise can be added to a daily session. The user will be able to create different sessions for different days, e.g. chest day, back day etc. The daily session has a foreign key userID, session name, duration, boolean isCompleted, notes/comments, and the session ID. The sessions will be stored in the users log, where the user will be able to look back at previous exercises. The log will contain a calendar and a log ID.

The user will also be able to get achievements based on their efforts in the gym. The achievements have an ID, description, and foreign key username that points to the user, foreign key weightGoal that points to how much weight the user can lift, and foreign key numOfTimesInGym which points at the workout logs and the number of entries there. The achievement will be triggered once the user sets a new personal record in weightlifting and when the user has visited the gym a substantial amount of times.

The leaderboard will display the top strongest users. We will fetch the weights from the workout log, and the userID from the users.

Pages:

Login page: Users can log in using email and password.
Home page: Contains paths (buttons) for all other pages.
Profile page: Users can change information and upload a profile picture.
Exercise page: Users can browse and create new exercises.
Sessions page: Users can browse and create new sessions.
Workout log page: Users can browse a calendar of sessions and edit past sessions.
Achievement page: Users can browse achievements and requirements.  
Leaderboard page: Users can see the top strongest users.
