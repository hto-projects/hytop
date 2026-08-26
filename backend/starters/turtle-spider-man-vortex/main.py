from turtle import *

# Create turtle
t = Turtle()
t.hideturtle()
t.speed(20)
t.pensize(2)

# Loop 500 times
for x in range(500):
  # If current iteration is an even number...
  if x % 2 == 0:
    # Set the color to blue
    t.color("blue")
  else:
    # Otherwise, set the color to red
    t.color("red")

  # Move forward more each time
  t.forward(x)

  # Turn
  t.right(90.2)
