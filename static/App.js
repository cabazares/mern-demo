

var PropertyFilter = React.createClass({
  displayName: "PropertyFilter",

  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement("div", { className: "listing-menu" }),
      React.createElement("div", { className: "filter-fields" })
    );
  }
});

var PropertyRow = React.createClass({
  displayName: "PropertyRow",

  render: function () {
    var prop = this.props.prop;

    var image = '';
    if (prop.defaultImage) {
      image = 'url("' + prop.defaultImage.medium + '")';
    } else if (prop.images.length) {
      image = 'url("' + prop.images[0].medium + '")';
    }

    var style = {
      width: this.props.width,
      height: this.props.width * 0.62,
      'background-image': image
    };

    var rowStyle = {
      width: this.props.width
    };
    return React.createElement(
      "div",
      { className: "property-row", style: rowStyle,
        onClick: this.props.setCoords,
        "data-lat": prop.location.lat, "data-lng": prop.location.lng },
      React.createElement("div", { style: style, className: "property-row-image" }),
      React.createElement(
        "div",
        { className: "details" },
        React.createElement(
          "div",
          { className: "prop-title" },
          prop.address,
          " \xB7 ",
          prop.city
        ),
        React.createElement(
          "div",
          null,
          prop.numberBedrooms,
          " bed, ",
          prop.numberBathrooms,
          " bath \xB7",
          prop.totalArea,
          " sqft \xB7 ",
          prop.minimumCreditScore,
          " credit"
        )
      )
    );
  }
});

var PropertyTable = React.createClass({
  displayName: "PropertyTable",

  getInitialState: function () {
    return {
      childWidth: 100
    };
  },
  render: function () {
    var _this = this;
    var rows = [];
    this.props.properties.forEach(function (prop, i) {
      rows.push(React.createElement(PropertyRow, { prop: prop, key: prop.id,
        width: _this.state.childWidth,
        setCoords: _this.props.setCoords }));
      if (i % 2 == 1) {
        rows.push(React.createElement("div", { className: "clear-both" }));
      }
    });
    return React.createElement(
      "div",
      { className: "properties-list" },
      rows,
      React.createElement("div", { className: "clear-both" })
    );
  },
  componentDidMount: function () {
    var _this = this;
    var container = this.getDOMNode();
    _this.setState({ childWidth: ($(container).width() - 60) / 2 });
  }
});

var PropertyPager = React.createClass({
  displayName: "PropertyPager",

  render: function () {
    var pages = [];
    for (var i = 1; i <= this.props.numPages; i++) {
      var isSelected = "page-link " + (i - 1 == this.props.currentPage ? "selected" : "");
      pages.push(React.createElement(
        "a",
        { href: "#", className: isSelected, onClick: this.props.switchPage, "data-page": i },
        i
      ));
    }
    return React.createElement(
      "div",
      { className: "pager-box" },
      React.createElement(
        "span",
        { className: "total-count" },
        this.props.total,
        " results"
      ),
      pages
    );
  }
});

var PropertyList = React.createClass({
  displayName: "PropertyList",

  getInitialState: function () {
    return {
      properties: [],
      currentPage: 0,
      maxPages: 6
    };
  },
  switchPage: function (e) {
    e.preventDefault();
    var page = $(e.target).data('page') - 1;
    var numPages = Math.ceil(this.state.properties.length / this.state.maxPages);
    if (page >= 0 && page < numPages) {
      this.setState({ currentPage: page });
    }
  },
  render: function () {
    var begin = this.state.currentPage * this.state.maxPages;
    var end = begin + this.state.maxPages;
    var numPages = Math.ceil(this.state.properties.length / this.state.maxPages);
    return React.createElement(
      "div",
      { id: "property-list-box" },
      React.createElement(
        "div",
        { className: "crumbs" },
        React.createElement(
          "a",
          { className: "crumb", href: "#" },
          "Home"
        ),
        ">",
        React.createElement(
          "a",
          { className: "crumb", href: "#" },
          "Rentals"
        ),
        ">",
        React.createElement(
          "a",
          { className: "crumb selected", href: "#" },
          "San Francisco"
        )
      ),
      React.createElement(
        "div",
        { className: "title" },
        "San Francisco Bay Area Rental Property Listings"
      ),
      React.createElement(
        "div",
        null,
        React.createElement(PropertyFilter, null)
      ),
      React.createElement(PropertyPager, { total: this.state.properties.length,
        currentPage: this.state.currentPage, numPages: numPages,
        switchPage: this.switchPage }),
      React.createElement(PropertyTable, { properties: this.state.properties.slice(begin, end),
        setCoords: this.props.setCoords }),
      React.createElement(PropertyPager, { total: this.state.properties.length,
        currentPage: this.state.currentPage, numPages: numPages,
        switchPage: this.switchPage })
    );
  },
  componentDidMount: function () {
    var _this = this;
    axios.get("/static/data.js").then(function (result) {
      _this.setState({
        properties: result.data.hits
      });
    });
  }
});

var PropertyMap = React.createClass({
  displayName: "PropertyMap",

  render: function () {
    return React.createElement(
      "div",
      { id: "gmap", ref: "map" },
      "I should be a map!"
    );
  },
  componentWillReceiveProps: function () {
    var location = { lat: this.props.lat, lng: this.props.lng };
    this.map.panTo(location);

    var marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
  },
  componentDidMount: function () {
    var _this = this;
    this.map = new google.maps.Map(this.refs.map, {
      center: {
        lat: _this.props.lat,
        lng: _this.props.lng
      },
      zoom: 16
    });
  }

});

var Wrapper = React.createClass({
  displayName: "Wrapper",

  getInitialState: function () {
    return {
      lat: 48.858608,
      lng: 2.294471
    };
  },
  setCoords: function (e) {
    var elem = $(e.target).closest('.property-row');
    this.setState({ lat: elem.data('lat'), lng: elem.data('lng') });
  },
  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { id: "header" },
        React.createElement("div", { className: "logo" }),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Browse"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "List Your Rental"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Renters"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "About"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Blog"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { id: "wrapper-main" },
        React.createElement(PropertyList, { setCoords: this.setCoords }),
        React.createElement(PropertyMap, { lat: this.state.lat, lng: this.state.lng })
      )
    );
  }
});

ReactDOM.render(React.createElement(Wrapper, null), document.getElementById('main'));