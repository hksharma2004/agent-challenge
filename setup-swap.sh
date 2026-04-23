#!/bin/bash

# setup-swap.sh
# This script creates a 4GB swap file to prevent Out-Of-Memory errors on 1GB RAM instances.

echo "Checking for existing swap..."
if grep -q "swapfile" /etc/fstab; then
    echo "Swap file already exists. Skipping."
    exit 0
fi

echo "Creating 4GB swap file..."
sudo fallocate -l 4G /swapfile

# If fallocate fails (e.g. on certain filesystems), use dd as fallback:
# sudo dd if=/dev/zero of=/swapfile bs=1M count=4096

echo "Setting correct permissions..."
sudo chmod 600 /swapfile

echo "Formatting swap space..."
sudo mkswap /swapfile

echo "Enabling swap..."
sudo swapon /swapfile

echo "Making swap permanent in /etc/fstab..."
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

echo "Tuning swappiness (optional but recommended for web servers)..."
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

echo "Swap setup complete! Current memory stats:"
free -h
