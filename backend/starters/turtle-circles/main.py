from turtle import *

# Create turtle and set speed
robyn = Turtle()
robyn.speed(5)
screen = robyn.getscreen()
screen.bgcolor("white")

# Loop 36 times
for x in range(36):
  # Draw a circle of size 60
  robyn.circle(60)

  # turn 10 degrees to the right
  robyn.right(10)
