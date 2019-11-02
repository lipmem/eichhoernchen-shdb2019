import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { throws } from "assert";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36]
});

let map;
let route;

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uistate: { from: false, to: false },
      from: null,
      to: null
    };
  }

  componentDidMount() {
    map = L.map("mapid").setView([52.485729, 13.435371], 13);
    let from;
    let to;

    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(map);

    var overlay = {
      Straßenbäume: L.tileLayer(
        "https://trees.codefor.de/tiles/strassenbaeume/{z}/{x}/{y}.png",
        {
          attribution: "Geoportal Berlin / Baumbestand Berlin",
          minZoom: 8,
          maxZoom: 20
        }
      ),
      Anlagenbäume: L.tileLayer(
        "https://trees.codefor.de/tiles/anlagenbaeume/{z}/{x}/{y}.png",
        {
          attribution: "Geoportal Berlin / Baumbestand Berlin",
          minZoom: 8,
          maxZoom: 20
        }
      )
    };

    overlay["Straßenbäume"].addTo(map);
    overlay["Anlagenbäume"].addTo(map);

    map.on("click", e => {
      axios
        .get("https://trees.codefor.de/api/trees/closest/", {
          params: { point: e.latlng.lng + "," + e.latlng.lat }
        })
        .then(res => {
          if (res.data.geometry) {
            if (this.state.uistate.from) {
              if (from) map.removeLayer(from);
              from = L.marker(
                L.latLng(
                  res.data.geometry.coordinates[1],
                  res.data.geometry.coordinates[0]
                )
              ).addTo(map);
              this.setState({ ...this.state, from: res.data.id });
            }
            if (this.state.uistate.to) {
              if (to) map.removeLayer(to);
              to = L.marker(
                L.latLng(
                  res.data.geometry.coordinates[1],
                  res.data.geometry.coordinates[0]
                )
              ).addTo(map);
              this.setState({ ...this.state, to: res.data.id });
            }
          }
        });
    });
  }

  componentWillUnmount() {}

  select(type) {
    if (type === "from") {
      this.setState({ ...this.state, uistate: { from: true, to: false } });
    }
    if (type === "to") {
      this.setState({ ...this.state, uistate: { from: false, to: true } });
    }
  }

  getRoute() {
    console.log(this.state);
    this.setState({ ...this.state, uistate: { from: false, to: false } });
    axios
      .get(
        "http://localhost:5000/app/api/v1.0/trees/?start_tree=" +
          this.state.from +
          "&end_tree=" +
          this.state.to
      )
      .then(data => {
        let newroute = [];
        for (let tree of data.data.trees) {
          tree.shift();
          newroute.push([tree[1], tree[0]]);
          if (route) map.removeLayer(route);
          route = L.polyline(newroute, { color: "red" }).addTo(map);
        }
      });
  }

  render() {
    let routeparam;

    if (false && this.state.from && this.state.to) {
      routeparam = (
        <div>
          <p>{this.state.from.lat}</p>
          <p>{this.state.from.lng}</p>
          <p>{this.state.to.lat}</p>
          <p>{this.state.to.lng}</p>
        </div>
      );
    }

    return (
      <div>
        <div className="btnWrap">
          <input
            onClick={e => this.select("from")}
            className={this.state.uistate.from ? "active" : null}
            placeholder="From"
            value={this.state.from}
          />
          <input
            onClick={e => this.select("to")}
            className={this.state.uistate.to ? "active" : null}
            placeholder="To"
            value={this.state.to}
          />

          <button onClick={e => this.getRoute()} className={"req-btn"}>
            GetRoute
          </button>
        </div>

        <div id="mapid"></div>
        {routeparam}
      </div>
    );
  }
}

export default Map;
