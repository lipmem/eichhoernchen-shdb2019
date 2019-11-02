from flask import Flask, jsonify, request
import pickle

app = Flask(__name__)

trees = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

##tree_path = pickle.load(open("file.p", "rb"))

@app.route('/app/api/v1.0/trees/', methods=['GET'])
def get_tasks():
	start_tree = request.args.get('start_tree', None)
	end_tree = request.args.get('end_tree', None)


	return jsonify({'trees': trees})


if __name__ == '__main__':
    app.run()
