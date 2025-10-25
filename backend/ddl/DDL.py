from database import get_db
import dotenv
import os
def run_DDL(DDL_QUERY):
    try:
        db = get_db()
        cur = db.cursor()
        con = db.connect()
        for query in DDL_QUERY.split(";"):
            if query.replace("\n","").replace("\t","") == "":
                continue
            cur.execute(query+";")
            cur.fetchall()
        print("DDL Good")
    except:
        print("DDL FAILED")
    finally:
        cur.close()
DDL_QUERY_DROP = """
DROP TABLE IF EXISTS `Log`;
DROP TABLE IF EXISTS `CategoryLink`;
DROP TABLE IF EXISTS `Chat`;
DROP TABLE IF EXISTS `Comment`;
DROP TABLE IF EXISTS `Pod_Member`;
DROP TABLE IF EXISTS `Pod`;
DROP TABLE IF EXISTS `KakaoAPI`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Category`;"""
DDL_QUERY = """
CREATE TABLE `User` (
	`user_id`	INT	NOT NULL,
	`username`	VARCHAR(100)	NOT NULL,
	`phonenumber`	VARCHAR(20)	NULL,
	`created_at`	TIMESTAMP	NULL
);


CREATE TABLE `KakaoAPI` (
	`k_id`	BIGINT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`access_token`	VARCHAR(255)	NULL,
	`refresh_token`	VARCHAR(255)	NULL,
	`user_name`	VARCHAR(100)	NULL,
	`profile_picture`	VARCHAR(255)	NULL
);


CREATE TABLE `Category` (
	`category_id`	INT	NOT NULL,
	`category_name`	VARCHAR(100)	NOT NULL,
	`parent_category_id`	INT	NULL
);


CREATE TABLE `Pod` (
	`pod_id`	INT	NOT NULL,
	`host_user_id`	INT	NOT NULL,
	`event_time`	DATETIME	NOT NULL,
	`place`	VARCHAR(255)	NOT NULL,
	`title`	VARCHAR(255)	NOT NULL,
	`content`	TEXT	NULL,
	`created_at`	TIMESTAMP	NULL
);


CREATE TABLE `Pod_Member` (
	`pod_member_id`	INT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`pod_id`	INT	NOT NULL,
	`amount`	INT	NULL,
	`place_start`	VARCHAR(255)	NULL,
	`place_end`	VARCHAR(255)	NULL,
	`joined_at`	TIMESTAMP	NULL
);


CREATE TABLE `Comment` (
	`comment_id`	INT	NOT NULL,
	`pod_id`	INT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`content`	TEXT	NOT NULL,
	`parent_comment_id`	INT	NULL,
	`created_at`	TIMESTAMP	NULL
);


CREATE TABLE `Chat` (
	`chat_id`	BIGINT	NOT NULL,
	`pod_id`	INT	NOT NULL,
	`user_id`	INT	NOT NULL,
	`content`	TEXT	NULL,
	`time`	TIMESTAMP	NOT NULL
);


CREATE TABLE `Log` (
	`log_id`	BIGINT	NOT NULL,
	`user_id`	INT	NULL,
	`log_code`	VARCHAR(50)	NULL,
	`time`	TIMESTAMP	NOT NULL,
	`content`	TEXT	NULL
);


CREATE TABLE `CategoryLink` (
	`category_link_id`	INT	NOT NULL,
	`category_id`	INT	NOT NULL,
	`pod_id`	INT	NOT NULL
);

ALTER TABLE `User` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
	`user_id`
);

ALTER TABLE `KakaoAPI` ADD CONSTRAINT `PK_KAKAOAPI` PRIMARY KEY (
	`k_id`
);

ALTER TABLE `Category` ADD CONSTRAINT `PK_CATEGORY` PRIMARY KEY (
	`category_id`
);

ALTER TABLE `Pod` ADD CONSTRAINT `PK_POD` PRIMARY KEY (
	`pod_id`
);

ALTER TABLE `Pod_Member` ADD CONSTRAINT `PK_POD_MEMBER` PRIMARY KEY (
	`pod_member_id`
);

ALTER TABLE `Comment` ADD CONSTRAINT `PK_COMMENT` PRIMARY KEY (
	`comment_id`
);

ALTER TABLE `Chat` ADD CONSTRAINT `PK_CHAT` PRIMARY KEY (
	`chat_id`
);

ALTER TABLE `Log` ADD CONSTRAINT `PK_LOG` PRIMARY KEY (
	`log_id`
);

ALTER TABLE `CategoryLink` ADD CONSTRAINT `PK_CATEGORYLINK` PRIMARY KEY (
	`category_link_id`,
	`category_id`
);

ALTER TABLE `KakaoAPI` ADD CONSTRAINT `FK_User_TO_KakaoAPI_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`user_id`
);

ALTER TABLE `Category` ADD CONSTRAINT `FK_Category_TO_Category_1` FOREIGN KEY (
	`parent_category_id`
)
REFERENCES `Category` (
	`category_id`
);

ALTER TABLE `Pod` ADD CONSTRAINT `FK_User_TO_Pod_1` FOREIGN KEY (
	`host_user_id`
)
REFERENCES `User` (
	`user_id`
);

ALTER TABLE `Pod_Member` ADD CONSTRAINT `FK_User_TO_Pod_Member_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`user_id`
);

ALTER TABLE `Pod_Member` ADD CONSTRAINT `FK_Pod_TO_Pod_Member_1` FOREIGN KEY (
	`pod_id`
)
REFERENCES `Pod` (
	`pod_id`
);

ALTER TABLE `Comment` ADD CONSTRAINT `FK_Pod_TO_Comment_1` FOREIGN KEY (
	`pod_id`
)
REFERENCES `Pod` (
	`pod_id`
);

ALTER TABLE `Comment` ADD CONSTRAINT `FK_User_TO_Comment_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`user_id`
);

ALTER TABLE `Comment` ADD CONSTRAINT `FK_Comment_TO_Comment_1` FOREIGN KEY (
	`parent_comment_id`
)
REFERENCES `Comment` (
	`comment_id`
);

ALTER TABLE `Chat` ADD CONSTRAINT `FK_Pod_TO_Chat_1` FOREIGN KEY (
	`pod_id`
)
REFERENCES `Pod` (
	`pod_id`
);

ALTER TABLE `Chat` ADD CONSTRAINT `FK_User_TO_Chat_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`user_id`
);

ALTER TABLE `Log` ADD CONSTRAINT `FK_User_TO_Log_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`user_id`
);

ALTER TABLE `CategoryLink` ADD CONSTRAINT `FK_Category_TO_CategoryLink_1` FOREIGN KEY (
	`category_id`
)
REFERENCES `Category` (
	`category_id`
);

ALTER TABLE `CategoryLink` ADD CONSTRAINT `FK_Pod_TO_CategoryLink_1` FOREIGN KEY (
	`pod_id`
)
REFERENCES `Pod` (
	`pod_id`
);


"""
dotenv.load_dotenv()

if os.environ['DDL_AUTO'].upper() == "TRUE":
    run_DDL(DDL_QUERY_DROP)
    run_DDL(DDL_QUERY)