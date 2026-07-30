from turtle import *

shelly = Turtle()
shelly.shape("turtle")
shelly.color("green")

paper = shelly.getscreen()
paper.bgcolor("gold")

for x in range(4):
  shelly.forward(100)
  shelly.right(90)

shelly.penup()
shelly.goto(-175, 75)
shelly.pendown()
shelly.speed(20)
shelly.color("purple")

for x in range(60):
  shelly.forward(200)
  shelly.right(186)

shelly.hideturtle()
