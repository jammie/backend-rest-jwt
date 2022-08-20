1. Get Started
`npm install --save`

2. Initialize database:

`npx sequelize-cli db:migrate`
`npx sequelize-cli db:seed:all`

From the seeder:

username: 'userdemo',
password: 'demouser'

How to use:
(update: change localhost:4000 => api-12322.herokuapp.com )

1.login 

curl --request POST \
  --url https://api-12322.herokuapp.com/login \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data username=userdemo \
  --data password=demouser

example response: 
{
	"success": true,
	"data": {
		"userId": 1,
		"username": "userdemo",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJkZW1vIiwiaWF0IjoxNjYwOTg1NjEyLCJleHAiOjE2NjA5ODkyMTJ9.wfFfxMP00BIcB52yE3UkQvPf2O3fH55y7koss1bESWk"
	}
}
2. get signed token and use to request

- search all with page

curl --request GET \
  --url 'http://localhost:4000/recruitment-position?page=2' \
  --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJkZW1vIiwiaWF0IjoxNjYwOTg1NjEyLCJleHAiOjE2NjA5ODkyMTJ9.wfFfxMP00BIcB52yE3UkQvPf2O3fH55y7koss1bESWk'

- search with page
curl --request GET \
  --url 'http://localhost:4000/recruitment-position/search?description=ruby&full_time=true&page=1' \
  --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJkZW1vIiwiaWF0IjoxNjYwOTg1NjEyLCJleHAiOjE2NjA5ODkyMTJ9.wfFfxMP00BIcB52yE3UkQvPf2O3fH55y7koss1bESWk'

- get position by id

curl --request GET \
  --url http://localhost:4000/recruitment-position/ed80af1f-d0bb-43ef-8bb4-9eab63fc41ec \
  --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJkZW1vIiwiaWF0IjoxNjYwOTg1NjEyLCJleHAiOjE2NjA5ODkyMTJ9.wfFfxMP00BIcB52yE3UkQvPf2O3fH55y7koss1bESWk'