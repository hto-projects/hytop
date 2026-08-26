# Import turtle AND math
from turtle import *
from math import *

tommy = Turtle()

def draw_shape(size):
  tommy.pendown()
  tommy.setheading(0)
  
  for x in range(8):
    tommy.forward(size)
    tommy.right(45.1)
    
  tommy.penup()
  
def get_color(x):
  return [100+((cos(pi+x/10)+1)/2)*155, 100+((cos(pi+x/80)+1)/2)*155, 100+((sin(x/11)+1)/2)*155]
  
tommy.penup()
tommy.pensize(3)
tommy.speed(0)
tommy.hideturtle()

# Set the background color to black
tommy.getscreen().bgcolor("black")

# Move the starting position
tommy.setpos(-60,150)

size = 118
tommy.setheading(0)

for x in range(40):
  tommy_color = get_color(x)
  tommy.color(f"rgb({tommy_color[0]}, {tommy_color[1]}, {tommy_color[2]})")
  
  draw_shape(size)
  
  size = size - 3
  
  tommy.sety(tommy.ycor()-5)
  tommy.setx(tommy.xcor()+1.5)
