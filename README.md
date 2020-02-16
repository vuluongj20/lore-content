# Lore Content

Lore Content is a content management system (CMS) for [Lore](https://github.com/vuluongj20/lore).

## Components
The CMS has three components:
* Front end (Angular)
* Back end (Express.js)
* Login page ([Sign](https://github.com/vuluongj20/sign))

## Try a demo
You can try a demo of Lore Content [here](https://lore-content.herokuapp.com/login/).

Use this account:
* Email: test@test.com
* Password: test

The account will allow you to make edits and go all the way to the preview page. Don't worry about these edits; they won't be saved. Feel free to try out as many things as you want!

## Run the code
Download the code and run it locally!

#### Directory structure
Below is are the most important directories:
```
- back
  - pages
    - content
    - login
    - main
- front
  - dist
- login
  - dist
```
There are three sub-directories in this repository:
* ```/back``` is the back-end Express.js project for both the content and login pages
* ```/front``` is the front-end Angular project for the content page
* ```/login``` is the front-end Angular project for the login page

#### How to run

To run the code, simply start a Node.js process from within ```/back```. If you made any edits to the front-end, re-build the Angular project and copy the corresponding code from ```/front/dist``` or ```/login/dist``` to ```/back/pages```.

## License
You may view the code and test run it locally. However, do not replicate it for any other purposes.
