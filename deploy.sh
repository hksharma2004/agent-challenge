#!/bin/bash

echo "Starting deployment setup..."

echo "Configuring Swap File for memory mitigation..."
bash ./setup-swap.sh

sudo apt update && sudo apt upgrade -y

if ! command -v docker &> /dev/null
then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    sudo usermod -aG docker $USER
    echo "Docker installed successfully! Note: You may need to log out and log back in for docker group changes to take effect."
else
    echo "Docker is already installed."
fi

if ! docker compose version &> /dev/null
then
    echo "Docker Compose plugin missing. Installing..."
    sudo apt-get install docker-compose-plugin -y
fi

if [ ! -f .env ]; then
    echo "Warning: .env file is missing! Your application may not start correctly without it."
    echo "Please create the .env file with your OPENAI_API_URL, OPENAI_API_KEY, etc."
fi

echo "Building and starting containers in detached mode..."
sudo docker compose up -d --build

echo ""
echo "=========================================================="
echo "Deployment initiated!"
echo "Check the logs using: sudo docker compose logs -f"
echo "=========================================================="
