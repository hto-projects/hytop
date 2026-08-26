from turtle import *
from math import *

# Create turtle
reggie = Turtle()
reggie.pensize(4)
reggie.speed(30)

screen = Screen()
screen.bgcolor("white")

# Set turtle position
reggie.penup()
reggie.setpos(-200,200)
reggie.pendown()

# Point downward
reggie.setheading(270)

# Loop 255 times
for x in range(400):
  # Set pen color based on current iteration
  reggie.color(f"rgb(0, {min(x, 255)}, {min(x, 255)}")

  # Move up or down the screen
  reggie.forward(400)

  # Move to the right (current x coordinate plus 1)
  reggie.setx(reggie.xcor()+1)

  # Point in the opposite direction
  reggie.setheading(reggie.heading()+180)
