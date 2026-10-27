# 🎮 2048 Game — Docker & GitHub Actions CI/CD

A browser-based implementation of the classic **2048 puzzle game**, containerized using Docker and integrated with a GitHub Actions CI/CD pipeline for automated code quality checks, security scanning, application testing, and Docker Hub image publishing.

This project demonstrates practical DevOps practices for building and distributing a lightweight web application.

## 🚀 Project Overview

The application uses HTML, CSS, and JavaScript for the frontend and Nginx Alpine to serve the static files inside a Docker container.

A GitHub Actions workflow automates the validation and publishing process whenever changes are pushed to the `main` branch.

### Key Features

- 🎮 Interactive 2048 browser game
- 🌐 HTML, CSS, and JavaScript frontend
- 🐳 Docker containerization using Nginx Alpine
- 🔍 Secret detection with Gitleaks
- 🛡️ Filesystem vulnerability and misconfiguration scanning with Trivy
- 🧹 HTML, CSS, JavaScript, and Dockerfile linting
- 🧪 Automated container startup and HTTP smoke tests
- 🔐 Docker image vulnerability scanning
- 📦 Automated publishing to Docker Hub
- 🔑 Secure authentication using GitHub Actions Secrets

## 🏗️ Architecture

```text
Developer
    |
    | Push / Pull Request
    v
GitHub Repository
    |
    v
GitHub Actions CI/CD
    |
    +--> Secret Detection (Gitleaks)
    |
    +--> Filesystem Security Scan (Trivy)
    |
    +--> Code & Dockerfile Linting
    |
    v
Build Docker Image
    |
    v
Run Container & Smoke Tests
    |
    v
Docker Image Vulnerability Scan
    |
    v
Publish Image to Docker Hub
    |
    +--> Commit SHA Tag
    |
    +--> latest Tag
```

The image publishing job runs only for qualifying pushes to `main` after the required checks succeed. Pull requests are validated without publishing images.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive presentation |
| JavaScript | Game logic and interaction |
| Docker | Application containerization |
| Nginx Alpine | Static web server |
| GitHub Actions | CI/CD automation |
| Gitleaks | Secret detection |
| Trivy | Security and vulnerability scanning |
| Super-Linter | Code quality and linting |
| Docker Hub | Container image registry |

## 📁 Project Structure

```text
my-2048-game/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── index.html
├── style.css
├── game.js
├── Dockerfile
└── README.md
```

## 🐳 Docker Configuration

The application uses the following Dockerfile:

```dockerfile
FROM public.ecr.aws/nginx/nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY game.js /usr/share/nginx/html/game.js

EXPOSE 80
```

### Why Docker?

- Provides a consistent runtime environment.
- Packages the application and its web server together.
- Simplifies testing and distribution.
- Allows the same image to be run across different Docker-compatible environments.

## 💻 Run the Application Locally

### Prerequisites

- Git
- Docker Desktop or Docker Engine

### 1. Clone the repository

Replace the example URL with your actual GitHub repository URL.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd my-2048-game
```

### 2. Build the Docker image

```bash
docker build -t my-2048-game:latest .
```

### 3. Run the container

```bash
docker run -d \
  --name game-2048 \
  -p 8080:80 \
  my-2048-game:latest
```

### 4. Open the application

Visit:

http://localhost:8080

### 5. Verify the container

```bash
docker ps
docker logs game-2048
```

### 6. Stop and remove the container

```bash
docker stop game-2048
docker rm game-2048
```

## 📦 Docker Hub

The Docker image is published to Docker Hub.

**Repository:** [manishdhaipulle/my-2048-game](https://hub.docker.com/r/manishdhaipulle/my-2048-game)

Pull the image:

```bash
docker pull manishdhaipulle/my-2048-game:latest
```

Run the published image:

```bash
docker run -d \
  --name game-2048 \
  -p 8080:80 \
  manishdhaipulle/my-2048-game:latest
```

Open http://localhost:8080 in your browser.

### Image Tagging Strategy

| Tag | Purpose |
|---|---|
| `latest` | Convenient reference to the latest successfully published build |
| `<commit-sha>` | Identifies a specific source revision and image build |

Example:

```text
manishdhaipulle/my-2048-game:latest
manishdhaipulle/my-2048-game:<commit-sha>
```

The `latest` tag is updated when a new image is successfully published. For traceability and rollback, prefer a specific commit SHA when selecting a particular build.

## ⚙️ GitHub Actions CI/CD Pipeline

Workflow file:

`.github/workflows/ci-cd.yml`

The pipeline automates the following stages.

### 1. Secret Detection — Gitleaks

Scans the repository for accidentally committed credentials, API keys, and other potential secrets.

**Goal:** Reduce the risk of exposing sensitive information in source control.

### 2. Filesystem Security Scan — Trivy

Scans the repository for supported vulnerabilities, misconfigurations, and secrets.

The workflow can be configured to fail when findings meet the selected severity threshold.

**Goal:** Detect security issues before building and publishing the application image.

### 3. Code Quality and Linting

Super-Linter validates the configured source files:

- HTML
- CSS
- JavaScript
- Dockerfile

**Goal:** Catch syntax problems, formatting issues, and common coding mistakes early.

### 4. Docker Build and Application Smoke Test

The pipeline builds the Docker image and starts a temporary container.

It then verifies that the application responds over HTTP and that the expected HTML, CSS, and JavaScript files are served.

**Goal:** Confirm that the container builds successfully and that the web application is accessible.

These are smoke tests, not a complete automated test suite for every 2048 gameplay scenario.

### 5. Docker Image Security Scan — Trivy

Scans the built image for container-image vulnerabilities.

**Goal:** Identify known vulnerable operating-system packages and application dependencies before publication.

The scan must reference the same image tag that was built and tested.

### 6. Docker Hub Authentication

The workflow authenticates using GitHub Actions repository secrets instead of hardcoded credentials.

Required secrets:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub personal access token with appropriate permissions |

Configure these under:

**GitHub Repository → Settings → Secrets and variables → Actions**

Never commit access tokens or passwords to the repository.

### 7. Publish the Docker Image

After the required checks pass, the pipeline publishes the image to:

https://hub.docker.com/r/manishdhaipulle/my-2048-game

The published image uses both a commit-specific tag and the `latest` tag.

The workflow does not deploy the application to a server or Kubernetes cluster.

## 🔐 Security Practices

This project follows several practical DevSecOps principles:

- Scan source files for exposed secrets.
- Scan the filesystem and container image for security findings.
- Use GitHub Actions Secrets for registry authentication.
- Apply least-privilege permissions where possible.
- Require successful validation jobs before image publishing.
- Use immutable commit-specific tags for build traceability.
- Avoid embedding credentials in Dockerfiles or source code.

Security scanners are only as effective as their configuration, vulnerability database, and severity policy. A passing scan does not guarantee that an image is completely secure.

## 🔄 CI/CD Workflow Triggers

The workflow is configured to run on:

- Pushes to `main`
- Pull requests targeting `main`
- Manual execution through `workflow_dispatch`

Only the appropriate successful `main` branch workflow run publishes images. Pull requests should not receive Docker Hub publishing credentials unnecessarily.

## 🧪 Manual Verification Commands

Check the image:

```bash
docker images
```

Inspect container status:

```bash
docker ps -a
```

Check application logs:

```bash
docker logs game-2048
```

Test the HTTP endpoint:

```bash
curl -I http://localhost:8080
```

Pull the published image:

```bash
docker pull manishdhaipulle/my-2048-game:latest
```

## 👨‍💻 Author
**Manish Dhaipulle**
DevOps & Cloud Platform Engineering
GitHub: https://github.com/Manishdgithub/githubAction2048
Docker Hub: https://hub.docker.com/repository/docker/manishdhaipulle/my-2048-game/general