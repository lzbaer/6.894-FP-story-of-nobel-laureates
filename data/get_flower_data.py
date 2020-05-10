import csv
import json
import re
import random

# Number of publications
# Different birth country
# Age when receiving award
# percent of publications with multiple authors

def get_country_name(name):
	german_countries = ['Germany', 'West Germany (Germany)', 'Germany (Poland)', 'Prussia (Germany)', 'Federal Republic of Germany']
	#Countries with instances of birth and organization country (combined) that is <= 10
	other_countries = ['Mexico', 'Morocco', 'Romania', 'Czechoslovakia', 'Pakistan', 'Alsace (then Germany, now France)', 'Bosnia and Herzegovina', 'Argentina', 'Algeria', 'Latvia', 'South Korea', 'Turkey', 'Spain', 'Egypt', 'New Zealand', 'Taiwan', 'Saint Lucia', 'Brazil', 'Finland', 'Lithuania', 'Slovenia', 'Portugal', 'Croatia', 'Luxembourg', 'South Africa', 'Azerbaijan', 'Belarus', 'Venezuela', 'Cyprus', 'Indonesia', 'Ireland', 'Czech Republic', 'Slovakia', 'Ukraine', 'India', 'Scotland', 'Hungary', 'Israel']
	actual = name
	if name in german_countries:
		actual = 'Germany'
	pattern_matches = re.findall(r"\([a-zA-z\s]*\)", name)
	if pattern_matches:
		if len(pattern_matches) > 1:
			print('Ambiguous country: {}'.format(name))
		else:
			matched = pattern_matches[0].strip('()')
			print(matched)
			actual = matched
	
	if actual in other_countries:
		actual = 'Other'
	return actual

def get_age(birthdate, award_year):
	birth_date_format = "%Y-%m-%d"
	if not birthdate:
		return 0
	birth_year = birthdate.split('-')[0]
	age = int(award_year) - int(birth_year)
	return age


def get_pub_records(filename):
	records = dict()
	with open(filename, newline='') as csvfile:
		reader = csv.DictReader(csvfile, delimiter=',')
		for row in reader:
			if row["Prize year"] not in records:
				records[row["Prize year"]] = dict()
			if row["Laureate ID"] not in records[row["Prize year"]]:
				laureate = dict()
				laureate["name"] = row["Laureate name"]
				laureate["papers"] = list()
				records[row["Prize year"]][row["Laureate ID"]] = laureate

			records[row["Prize year"]][row["Laureate ID"]]['papers'].append(row['Paper ID'])
	return records

def main():
	results = list()

	pub_records = dict()
	pub_records["medicine"] = get_pub_records('Medicine publication record.csv')
	pub_records["physics"] = get_pub_records('Physics publication record.csv')
	pub_records["chemistry"] = get_pub_records('Chemistry publication record.csv')

	with open('archive.csv', newline='') as csvfile:
		reader = csv.DictReader(csvfile, delimiter=',')
		for row in reader:
			if row["Laureate Type"] != 'Individual':
				continue
			#filter out fields that are not science
			if row["Category"].lower() not in ["chemistry", "medicine", "physics"]:
				continue
			laureate = dict()
			laureate["name"] = row["Full Name"]
			laureate["lastName"] = laureate["name"].split(' ')[-1]
			laureate["field"] = [row["Category"].lower()]
			laureate["year"] = row["Year"]
			laureate["age"] = get_age(row["Birth Date"], row["Year"])
			if laureate["age"] == 0:
				print("Missing age for laureate {}".format(laureate["name"]))
			if row["Birth Country"].lower() == row["Organization Country"].lower():
				laureate["mobility"] = 0
			else:
				laureate["mobility"] = 1
			#TODO: get actual number of publications
			laureate["numPublications"] = random.randint(1, 100)

			#numPublications
			# if laureate["field"] in pub_records:
			# 	if laureate["year"] in pub_records[laureate["field"]]:
			# 		field_winners_for_year = pub_records[laureate["field"]][laureate["year"]]
			# 		if len(field_winners_for_year) == 1:
			# 			laureate_dict = field_winners_for_year[list(field_winners_for_year.keys())[0]]
			# 			laureate["numPublications"] = len(laureate_dict["papers"])
			# 		else:
			# 			laureate_names = [x["name"].split(',') for _,x in field_winners_for_year.items()]
			# 			print(laureate_names)
			# 			initials = ""
			# 			for index, n in enumerate(laureate["name"].split(' ')):
			# 				if index == len(laureate["name"].split(' ')) - 1:
			# 					last_name = n
			# 				else:
			# 					initials += n[0]
			# 			print("{}, {}".format(last_name, initials))
			# 			exit(0)
			# 			print(laureate["name"].split(' ')[-1].lower())
			# 			print(laureate["name"].split(' '))
			# 			if laureate["name"].split(' ')[-1].lower() in laureate_names:
			# 				print('woo')
			# 			exit()

			results.append(laureate)

	# print results to json
	with open('flowerdata.json', 'w') as json_file:
		json.dump(results, json_file)

main()