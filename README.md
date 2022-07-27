# Automation tool for NFTs on the Wax Blockchain (Forked from EOS blockchain)

Purpose:
* Built this tool to learn how the EOS/Waxblockchain works for NFTs
* Tool auto-harvests and autostakes for two NFT games: Farmingtales and Golmangame
* A project for me to learn how to create React apps and write unit tests for React components
* I wanted a refresher on how to use AWS again so I was building this tool to keep track of usage across future users. I setup the routing, DB, and used AWS Amplify to quickly iterate

TODO:
* Improve UI
* Add instructions for AWS Dynamo Database configuration 
* Make the tool general purpose for any NFT game


Support of login via OAuth to your Wax Account
![This is an image](https://github.com/henryksarat/wax_blockchain_nft_automation/blob/main/assets/wax_automation_not_logged_in.png)

After Login Automation for auto-harvesting of NFTs and auto-staking, example here is for Farmingtales:
![This is an image](https://github.com/henryksarat/wax_blockchain_nft_automation/blob/main/assets/wax_automation_before.png)

After auto-harvest and auto-staking, a countdown for the next time:
![This is an image](https://github.com/henryksarat/wax_blockchain_nft_automation/blob/main/assets/wax_automation_after.png)


How to configure the app

```
In src/DatabaseConnection.js set the **BASE_URL** to be the URL to your database location. I will define the structure of the database in this repo in the future.
```

To start the app

```
npm start
```