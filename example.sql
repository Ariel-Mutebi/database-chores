create table if not exists honestly_nevermind (
  song_popularity serial primary key,
  song_name varchar(255) not null
);

insert into honestly_nevermind (song_name) values ('Jimmy Cooks');

select song_name
from honestly_nevermind
order by song_popularity
limit 1;