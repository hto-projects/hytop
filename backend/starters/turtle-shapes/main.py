import turtle

screen = turtle.getscreen()
screen.bgcolor("white")

turtle.penup()
turtle.goto(-100, 5)
turtle.pendown()

#Рисуем окружность с положительным значением радиуса
turtle.circle(50)

turtle.penup()
turtle.goto(-100, -5)
turtle.pendown()

#Рисуем окружность с отрицательным значением радиуса
turtle.circle(-50)

turtle.penup()
turtle.goto(5, 5)
turtle.pendown()

#Рисуем дугу в 180 градусов с положительным значением
turtle.circle(50, 180)

turtle.penup()
turtle.goto(5, -105)
turtle.pendown()
turtle.seth(0)

#Рисуем дугу в 270 градусов с отрицательным значением
turtle.circle(50, -270)

turtle.penup()
turtle.goto(120, 5)
turtle.pendown()
turtle.seth(0)

#Рисуем пятиугольник
turtle.circle(50,360,5)

turtle.penup()
turtle.goto(120, -105)
turtle.pendown()

#Рисуем восьмиугольник
turtle.circle(50,360,8)

turtle.mainloop()
