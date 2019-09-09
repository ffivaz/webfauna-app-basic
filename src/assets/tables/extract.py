import urllib2
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

groups = [2,5,40,104,44,25,22,30,31,4,47,100,24,23,1,3]
group_json_array = []

for group in groups:
    url = "https://webfauna-api.cscf.ch/webfauna-ws/api/v1/systematics/groups/" + str(group)
    req = urllib2.Request(url)
    opener = urllib2.build_opener()
    f = opener.open(req)
    group_json_array.append(json.loads(f.read())['resource'][0])

with open('groups.json', 'w') as f:
    json.dump(group_json_array, f)

species_json_array = []

for group in groups:
    url = "https://webfauna-api.cscf.ch/webfauna-ws/api/v1/systematics/groups/" + str(group) + "/species"
    req = urllib2.Request(url)
    opener = urllib2.build_opener()
    f = opener.open(req)
    json_array = json.loads(f.read())['resource']
    for species in json_array:
        del species['links'][0]
        del species['family']
        if 'en' in species['vernacularNames']:
            del species['vernacularNames']['en']
        if 'image' in species:
            del species['image']
        species_json_array.append(species)

with open('species.json', 'w') as f:
    json.dump(species_json_array, f)

langs = ['fr', 'de', 'it']
concepts = ['env', 'mec', 'sbt', 'mth', 'prd', 'tsp', 'typ']

for concept in concepts:
    concept_json_array = []

    for lang in langs:
        url = "https://webfauna-api.cscf.ch/webfauna-ws/api/v1/thesaurus/realms/" + concept + "/values"
        req = urllib2.Request(url, headers={"accept-language" : lang})
        opener = urllib2.build_opener()
        f = opener.open(req)
        json_array = json.loads(f.read())['resource']
        for obj in json_array:
            concept_json_array.append(obj)

    filename = concept + ".json"
    with open(filename, 'w') as f:
        json.dump(concept_json_array, f)
