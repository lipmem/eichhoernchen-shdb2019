from flask import Flask, jsonify, request
import pickle
import networkx as nx
import pandas as pd

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


##tree_path = pickle.load(open("file.p", "rb"))
def getPath(start_id, end_id):
    p = nx.algorithms.shortest_paths.weighted.dijkstra_path(
        G, start_id, end_id)
    return [(int(i), x[trees[trees.id == i].index][0], y[trees[trees.id == i].index][0]) for i in p]


@app.route('/app/api/v1.0/trees/', methods=['GET'])
def get_tasks():
    start_tree = request.args.get('start_tree', None)
    end_tree = request.args.get('end_tree', None)
    trees = getPath(int(start_tree), int(end_tree))

    return jsonify({'trees': trees})


if __name__ == '__main__':
    [G, trees, x, y] = pickle.load(open("routing_data.pickle", "rb"))
    app.run()
