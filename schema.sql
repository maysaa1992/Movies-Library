
DROP TABLE IF EXISTS trending_moves;
CREATE TABLE IF NOT EXISTS trending_moves (
    id SERIAL NOT NULL ,
    PRIMARY KEY (id),
    title VARCHAR(255),
    comments VARCHAR(255)
);
