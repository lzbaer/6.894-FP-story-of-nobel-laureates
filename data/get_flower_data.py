import csv
import json
import re
import random
from fractions import Fraction
import unicodedata

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


def strip_accents(text):

    try:
        text = unicode(text, 'utf-8')
    except NameError: # unicode is a default on python 3 
        pass

    text = unicodedata.normalize('NFD', text)\
           .encode('ascii', 'ignore')\
           .decode("utf-8")

    return str(text)


def main():
	results = list()

	with open('archive_apiv2.json', newline='') as jsonfile:
		reader = json.load(jsonfile)
		reader = reader["laureates"]
		for row in reader:
			for prize in row["nobelPrizes"]:
				#filter out fields that are not science
				# if prize["category"]["en"].lower() not in ["chemistry", "physiology or medicine", "physics"]:
				# 	continue
				laureate = dict()
				try:
					laureate["name"] = row["knownName"]["en"]
					laureate["href"] = row['links']['href']
					if "familyName" in row:
						laureate["lastName"] = strip_accents(row["familyName"]["en"]).replace("-", "").replace("'", "").replace(" ", "")
					else:
						laureate["lastName"] = strip_accents(laureate["name"].split()[-1])
						print(laureate["lastName"])
						print(laureate["name"])
					laureate["normalized_name"] = strip_accents(laureate["name"])

				except:
					if "orgName" in row.keys():
						continue
					else:
						print('Name issue')
						print(row)

						raise
				
				category = prize["category"]["en"].lower()
				if category == "physiology or medicine":
					category = "medicine"
				laureate["field"] = [category]
				laureate["year"] = prize["awardYear"]
				laureate["age"] = get_age(row["birth"]["date"], laureate["year"])
				if laureate["age"] == 0:
					print("Missing age for laureate {}".format(laureate["name"]))
				birth_country = row["birth"]["place"]["country"]["en"].lower()
				working_country = []
				try:
					if "affiliations" in prize.keys():
						locations = prize["affiliations"]
					elif "residences" in prize.keys():
						locations = prize["residences"]
					else:
						print("Missing mobility value for {}".format(laureate["name"]))
						# print(row)
					for aff in locations:
						if "country" in aff.keys():
							working_country.append(aff["country"]["en"].lower())
					countries = list(filter((birth_country).__ne__, working_country))
				except:
					print(row["nobelPrizes"])
					print(row["nobelPrizes"][0].keys())
					raise

				if len(countries):
					laureate["mobility"] = 1
				else:
					laureate["mobility"] = 0
				if float(Fraction(row["nobelPrizes"][0]["portion"])) < 1:
					laureate["collaborate"] = 1
				else:
					laureate["collaborate"] = 0

				results.append(laureate)

	print('completed')
	# print results to json
	with open('allflowerdata.json', 'w') as json_file:
		json.dump(results, json_file)

main()