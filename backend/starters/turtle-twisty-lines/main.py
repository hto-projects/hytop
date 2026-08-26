from turtle import *

# Create turtle, set speed, and hide
ninja = Turtle()
ninja.hideturtle()
ninja.speed(0)

# set bg color
screen = Screen()
screen.bgcolor("white")

# Loop 90 times
for i in range(90):
    # Head in a new direction
    ninja.setheading(i*4)

    # Draw twisty lines
    ninja.forward(50)
    ninja.right(40)
    ninja.forward(25)
    ninja.left(60)
    ninja.forward(50)
    
    # Move back to the center
    ninja.penup()
    ninja.setposition(0, 0)
    ninja.pendown()
