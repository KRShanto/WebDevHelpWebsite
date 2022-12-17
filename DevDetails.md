# WebDevHelp development details

Hello world! This file describes the tech stack and internel details about the project.

If you are new to this project then you should visit [README](README.md) file

## Tech Stack

This project uses **Typescript** as the core language.

It is built on top of **Next.js** and **Express.js**.

**Next.js** for the frontend and **Express.js** for the backend.

It uses **Mongodb Atlas** as a database.

It uses **Socket.io** for handling websocket connections.

## Website Routes

### /

This is the landing page of the website. This includes the introduction of the site

### /chat

This is where *most* people will come to ask their problems.
Generally people who have problems with *logic* (not error), they will discuss their problems here.

There will be lots of *channels* where people can discuss their specific problems in specific channels.

For example if someone is facing issues with Javascript, then he/she can go to the *Javascript* channel and discuss their problems with others.

People who are interested to help others, they can also turn on the notification bell on each channels so that they can get notified when a new message arrives.

*NOTE: The concept of channels is much similar to the discord's channels*.

### /errors

This is where people will come and discuss about their errors. It is true that most of the errors can be solved by going to the *stackoverflow*, but some errors requires professionals to solve them.

Their *will be* a feature when a user copy and paste the error, a bot will try to get the solution on the internet and then the problem *can be* solved by just going to the link sent by the bot.

Note that this page only shows the collection of error's titles. When a user clicks any error title, he/she will be redirected to he */errors/{index}* page.

These errors and chats will be saved on the database. Although users can delete these errors if he/she wishes to.

### /errors/{index}

This is where people can chat and discuss about the error. We *will* build a bot system where the bot will try to search the errors and share the link.

### /qa

This page is much similar to **/errors** page but instead of asking errors, people will ask any questions in their mind.

Note that will page will be indexed by google. So we have to make this page **SEO friendly**.

### /qa/{index}

This is where people can chat and answer and discuss about the specific question

### /settings

Settings of the users and settings of the whole site (for admins).

Users can change their themes, emails, names, logout and even delete their accounts in this page.

### /login

Login page

### /signup

Create account
