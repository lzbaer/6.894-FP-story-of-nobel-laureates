import csv
import json
import re
import random
from fractions import Fraction
import unicodedata

def strip_accents(text):

    try:
        text = unicode(text, 'utf-8')
    except NameError: # unicode is a default on python 3 
        pass

    text = unicodedata.normalize('NFD', text)\
           .encode('ascii', 'ignore')\
           .decode("utf-8")

    return str(text)

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
	missing = list()
	duplicate = list()
	pub_records = dict()
	pub_records["medicine"] = get_pub_records('Medicine publication record.csv')
	pub_records["physics"] = get_pub_records('Physics publication record.csv')
	pub_records["chemistry"] = get_pub_records('Chemistry publication record.csv')

	with open('archive_apiv2.json', newline='') as jsonfile:
		reader = json.load(jsonfile)
		reader = reader["laureates"]
		for row in reader:
			for prize in row["nobelPrizes"]:
				#filter out fields that are not science
				if prize["category"]["en"].lower() not in ["chemistry", "physiology or medicine", "physics"]:
					continue
				laureate = dict()
				try:
					laureate["name"] = row["knownName"]["en"]
					laureate["lastName"] = strip_accents(row["familyName"]["en"]).replace("-", "").replace("'", "").replace(" ", "")
					laureate["normalized_name"] = strip_accents(laureate["name"])

				except:
					if "orgName" in row.keys():
						continue
					else:
						print(row)
						exit()
				
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
					# if len(locations) > 1:
					# 	print("{} locations found".format(len(locations)))
					# 	print(locations)
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
				#TODO: get actual number of publications
				laureate["numPublications"] = -1
				# laureate["numPublications"] = random.randint(1, 100)

				#numPublications
				field = laureate["field"][0]
				if field in pub_records:
					if laureate["year"] in pub_records[field]:
						field_winners_for_year = pub_records[field][laureate["year"]]
						if len(field_winners_for_year) == 1:
							laureate_dict = field_winners_for_year[list(field_winners_for_year.keys())[0]]
							laureate["numPublications"] = len(laureate_dict["papers"])
						else:
							laureate_names = [x["name"].replace('.', ',').replace(", ", ",").replace(" ", ",").split(',') for _,x in field_winners_for_year.items()]
							# print(laureate_names)
							last_names = [x[0].lower() for x in laureate_names]
							if laureate["lastName"].lower() not in last_names:
								indices = []
								for i, name in enumerate(last_names):
									if name in laureate["lastName"].lower():
										indices.append(i)
								if len(indices) == 1:
									index = indices[0]
									laureate_dict = field_winners_for_year[list(field_winners_for_year.keys())[index]]
									laureate["numPublications"] = len(laureate_dict["papers"])
								else: 
									print("Missing {} from {}".format(laureate["lastName"], laureate_names))
									missing.append(laureate["lastName"])
							else:
								if last_names.count(laureate["lastName"].lower()) > 1:
									full_name = row["fullName"]["en"]
									names = full_name.split(' ')
									initials = [x[0].lower() for x in names[:-1]]
									initials = "".join(initials)
									print(initials)
									indices = [i for i, x in enumerate(last_names) if x == laureate["lastName"].lower()]
									found = False
									for index in indices:
										for part in laureate_names[index]:
											if initials[0:len(part)] == part:
												laureate_dict = field_winners_for_year[list(field_winners_for_year.keys())[index]]
												laureate["numPublications"] = len(laureate_dict["papers"])
												found = True
												break
											if found == True:
												break
									if found == False:
										print("Duplicate {} from {}".format(laureate["lastName"], laureate_names))
										duplicate.append(laureate["lastName"])
								else:
									index = last_names.index(laureate["lastName"].lower())
									laureate_dict = field_winners_for_year[list(field_winners_for_year.keys())[index]]
									laureate["numPublications"] = len(laureate_dict["papers"])
							# initials = ""
							# for index, n in enumerate(laureate["name"].split(' ')):
							# 	if index == len(laureate["name"].split(' ')) - 1:
							# 		last_name = n
							# 	else:
							# 		initials += n[0]
							# print("{}, {}".format(last_name, initials))
							# exit(0)
							# print(laureate["name"].split(' ')[-1].lower())
							# print(laureate["name"].split(' '))
							# if laureate["name"].split(' ')[-1].lower() in laureate_names:
							# 	print('woo')
							
				if laureate["numPublications"] != -1:
					results.append(laureate)

	# print results to json
	with open('flowerdata.json', 'w') as json_file:
		json.dump(results, json_file)

main()