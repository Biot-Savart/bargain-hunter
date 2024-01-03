# Bargain Hunter Node.js Web Scraper

A simple yet powerful Node.js application for scraping websites for deals and discounts. This project uses Axios for making HTTP requests, Cheerio for parsing HTML, and node-cron for scheduling tasks. It's designed to notify users via Discord when it finds deals that match specified criteria.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

To get the project running, follow these steps:

1. **Clone the Repository**
   git clone https://github.com/Biot-Savart/bargain-hunter.git
   cd bargain-hunter

2. **Install Dependencies**
   npm install

3. **Setting Up Environment Variables**

- Create a `.env` file in the root directory.
- Add the necessary environment variables, e.g., `DISCORD_WEBHOOK_URL`.

4. **Start the Application**
   npm start

## Features

- Web scraping functionality using Axios and Cheerio.
- Scheduled scraping with node-cron.
- Discord notifications for found deals.
- Environment variable management for sensitive data.

## Usage

After setting up the project, it will periodically check for deals based on the specified schedule in the cron configuration. When a deal meeting the set criteria is found, the application will send a notification to the configured Discord channel.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- **Ryno Myburgh** - _Initial Work_ - [Biot-Savart](https://github.com/Biot-Savart)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Hat tip to anyone whose code was used as inspiration.
- The open-source community for continuous learning and sharing.
