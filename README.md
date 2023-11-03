# Project Title

## Demo





https://github.com/chinguun101/KanbanBoardFullStack/assets/100122425/87980133-22c7-4470-ad61-df89992faa22





## Features
- **User Account Management**:
  - Register and log in to accounts with client and server-side validation.
  
- **List Management**:
  - Create, rename, and delete lists.
  - Reorder lists; the updated order is saved.

- **Task Management**:
  - Add, rename, and delete tasks within lists.
  - Move tasks or subtasks to other lists; they become main tasks at the bottom of the destination list.
  - Tasks can have an unlimited number of nested subtasks.
  - Toggle visibility of subtask layers using an accordion view.
  - Mark tasks as completed; status is saved.
  - Recursive task logic ensures correct handling of nested tasks.

- **List Overview**:
  - Display task completion status in the list header.
  - Highlight in green when all tasks in a list are completed.

- **Authorization & Authentication**:
  - Comprehensive user auth ensures only authorized access to lists and tasks.
  - Restricted page access for non-logged-in users.

- **Responsive Design**:
  - Fully responsive on all devices.

## Setup

### Clone the Repository
```bash
git clone <repository-url>

```
## Virtual Environment setup 
```bash
conda create -n myenv python
conda activate myenv
```


## FrontEnd Setup 
``` bash 
cd client
npm install
npm start
```

Open http://localhost:3000 in your browser.


## Back-End Setup 
``` bash 
cd ..
cd server
pip install -r requirements.txt
cd flask_backend
python main.py
```

