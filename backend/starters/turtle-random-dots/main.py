# Import turtle AND randint
from turtle import *
from random import randint

# Create turtle, set speed, and hide
dotty = Turtle()
dotty.hideturtle()
dotty.speed(0)

# Set pen color and fill color
dotty.pencolor("black")
dotty.fillcolor("white")

screen = Screen()
screen.bgcolor("white");

for x in range(10):
  # Generate a random x location (between -175 and 175)
  x_loc = randint(-175, 175)

  # Generate a random y location (between -175 and 175)
  y_loc = randint(-175, 175)
  
  # Move to the random location 
  dotty.penup()
  dotty.setpos(x_loc, y_loc)
  dotty.pendown()
  
  # Draw dot
  dotty.begin_fill()
  dotty.circle(10)
  dotty.end_fill()
