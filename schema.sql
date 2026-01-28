use TaskManagement

create TABLE Users (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL
);


CREATE TABLE Tasks (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
    DueDate DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UserID INT,
    CONSTRAINT fk_tasks_user
        FOREIGN KEY (UserID) REFERENCES Users(ID)
);


create TABLE logs(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    TaskID int,
    UserID int,
    oldState ENUM('To Do', 'In Progress', 'Done'),
    newState ENUM('To Do', 'In Progress', 'Done'),
    ChangedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    constraint fk_logs_task
        FOREIGN KEY (TaskID) REFERENCES Tasks(ID),
    constraint fk_logs_user
        FOREIGN KEY (UserID) REFERENCES Users(ID)
);