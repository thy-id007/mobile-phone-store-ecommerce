# PostgreSQL Database Initialization Guide

This directory contains the complete database scripts for the Mobile Phone Store E-Commerce system.

## Files
- `schema.sql`: Complete 3NF DDL creating all 14 tables, UUID extensions, foreign keys, and indexes.
- `seeds.sql`: Initial mock data containing smartphone models (iPhone 16 Pro Max, Galaxy S24 Ultra, Pixel 9 Pro XL, Xiaomi 14 Ultra), variants, specifications, categories, brands, discounts, and demo user accounts.

## Quick Setup

### 1. Create Database
```bash
psql -U postgres -c "CREATE DATABASE mobilestore_db;"
```

### 2. Apply Schema & Seeds
```bash
psql -U postgres -d mobilestore_db -f schema.sql
psql -U postgres -d mobilestore_db -f seeds.sql
```

## Default Accounts
- **Store Administrator**: `admin@phonestore.com` / `password123`
- **Customer Account**: `customer@gmail.com` / `password123`
