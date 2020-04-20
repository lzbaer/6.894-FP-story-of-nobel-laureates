import csv
import json
import re


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


def main():
	matrix = dict()
	locations = dict()
	with open('archive.csv', newline='') as csvfile:
		reader = csv.DictReader(csvfile, delimiter=',')
		for row in reader:
			if row["Birth Country"] == "" or row['Organization Country'] == "":
				continue
			row["Birth Country"] = get_country_name(row["Birth Country"])
			row['Organization Country'] = get_country_name(row["Organization Country"])
			if row["Birth Country"] not in locations:
				locations[row["Birth Country"]] = 0
			if row['Organization Country'] not in locations:
				locations[row["Organization Country"]] = 0
			if row["Birth Country"] not in matrix:
				matrix[row["Birth Country"]] = dict()
			if row['Organization Country'] not in matrix[row["Birth Country"]]:
				matrix[row["Birth Country"]][row['Organization Country']] = 1
			else:
				matrix[row["Birth Country"]][row['Organization Country']] += 1
			locations[row["Birth Country"]] += 1
			locations[row["Organization Country"]] += 1

	# locations = sorted(locations)
	# to_pop = list()
	# for location, count in locations.items():
	# 	if count < 5:
	# 		to_pop.append(location)

	# print('Popping: {}'.format(to_pop))
	# for key in to_pop:
	# 	locations.pop(key)

	result = list()
	names = list()
	for b_location in locations.keys():
		if b_location not in matrix:
			vector = [0]* len(locations)
			result.append(vector)
			names.append(b_location)
			continue
		vector = list()
		for o_location in locations.keys():
			if o_location not in matrix[b_location]:
				vector.append(0)
			else:
				vector.append(matrix[b_location][o_location])
		names.append(b_location)
		result.append(vector)

	output = {
		'result': result,
		'names' : names
	}
	print(locations)
	print(len(names))
	# print results to json
	with open('data.json', 'w') as json_file:
		json.dump(output, json_file)

main()