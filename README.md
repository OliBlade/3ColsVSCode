# 3Cols
## About 3Cols

[3Cols](https://3cols.com/) is a free cloud-based snippet manager allowing you to share code snippets with a team enabling greater productivity and encouraging reusable code.

***

## 3Cols Extension
This Extension gives VSCode users the ability to insert, update and create 3Cols Snippets. This includes Snippets stored in Boards shared with the user via [3Cols sharing](https://docs.3cols.com/boards/sharingaboard).

This extension is open source and powered with the [3Cols API](https://docs.3cols.com/api/apiintroduction).

### Getting Started

1. Install the 3Cols extension.
2. Get your API Key from your [3Cols account page](https://3cols.com/account).
<img src="https://github.com/OliBlade/3ColsVSCode/blob/master/resources/3ColsAccountApi.png?raw=true" />
4. Add your API Key to the 3Cols "Api Key" setting.
<img src="https://github.com/OliBlade/3ColsVSCode/blob/master/resources/apiKey.png?raw=true" />

### Commands
`Please Note: Command shortcuts are not bound by default, but can be configured in Keyboard Shortcuts.`

<img src="https://github.com/OliBlade/3ColsVSCode/blob/master/resources/keyBinding.png?raw=true" />

#### Get Snippet
> Available on right click, or in command pallet

Inserts your Snippet. If no file is open, this will open a file and configure the language based on your Snippet language.

#### Save Snippet
> Available on right click, or in command pallet when a file is open

Saves or Creates a new Snippet with the following properties: 
- Content: If highlighting, only the highlighted text will be saved.
- Language: Based on the language of the currently open file.
- Name: Only editable, if creating a new Snippet.

`Please be aware this will overwrite the selected Snippet.`
