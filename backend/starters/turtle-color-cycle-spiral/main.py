# Import turtle AND math
from turtle import *
from math import *

# Create turtle
tommy = Turtle()
tommy.speed(0)
tommy.pensize(3)
tommy.hideturtle()

# Set the background color to black
tommy.getscreen().bgcolor("black")

# Move the starting position
tommy.penup()
tommy.setpos(-60,160)
tommy.pendown()

# Loop 600 times
for x in range(600):
  # Set the color so that it cycles
  tommy.color(f"rgb({100+((cos(pi+x/80)+1)/2)*155}, {100+((sin(pi+x/80)+1)/2)*155}, {100+((sin(x/80)+1)/2)*155})")
  
  # Move forward less each iteration
  tommy.forward(120-(x/5))
  
  # turn 40 degrees each iteration
  tommy.right(40)
