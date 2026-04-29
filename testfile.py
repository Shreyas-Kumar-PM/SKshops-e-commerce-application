#!/usr/bin/python3 env

def main():
	printf("Enter the value to search:")
	name = input()
	names = ["Shreyas","Saurabh","Mayank"]
	if name in names:
		print("Name entereed is present in the list!")
	else:
		print("Name entered is not present in the list!")

main()

