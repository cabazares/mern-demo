

var PropertyFilter = React.createClass({
  render: function() {
    return (
      <div>
        <div className="listing-menu"></div>
        <div className="filter-fields">
        </div>
      </div>
    )
  }
});

var PropertyRow = React.createClass({
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
    }
    return (
      <div className="property-row" style={rowStyle}
          onClick={this.props.setCoords}
          data-lat={prop.location.lat} data-lng={prop.location.lng}>
        <div style={style} className="property-row-image"></div>
        <div className="details">
          <div className="prop-title">{prop.address} · {prop.city}</div>
          <div>{prop.numberBedrooms} bed, {prop.numberBathrooms} bath ·
                {prop.totalArea} sqft · {prop.minimumCreditScore} credit</div>
        </div>
      </div>
    )
  }
});

var PropertyTable = React.createClass({
  getInitialState: function () {
    return {
      childWidth: 100
    };
  },
  render: function() {
    var _this = this;
    var rows = [];
    this.props.properties.forEach(function(prop, i) {
      rows.push(<PropertyRow prop={prop} key={prop.id}
                   width={_this.state.childWidth}
                   setCoords={_this.props.setCoords}/>);
      if ((i % 2) == 1) {
        rows.push(<div className="clear-both" />);
      }
    });
    return (
      <div className="properties-list">
        {rows}
        <div className="clear-both" />
      </div>
    )
  },
  componentDidMount: function () {
    var _this = this;
    var container = this.getDOMNode();
      _this.setState({childWidth: ($(container).width() - 60) / 2});
  }
});

var PropertyPager = React.createClass({
  render: function () {
    var pages = [];
    for (var i=1; i <= this.props.numPages;i++) {
      var isSelected = "page-link " + (((i - 1) == this.props.currentPage)? "selected" : "");
      pages.push(<a href="#" className={isSelected} onClick={this.props.switchPage} data-page={i}>{i}</a>)
    }
    return (
      <div className="pager-box">
        <span className="total-count">{this.props.total} results</span>
        {pages}
      </div>
    );
  }
});

var PropertyList = React.createClass({
  getInitialState: function () {
    return {
      properties: [],
      currentPage: 0,
      maxPages: 6,
    };
  },
  switchPage: function(e) {
    e.preventDefault();
    var page = $(e.target).data('page') - 1;
    var numPages = Math.ceil(this.state.properties.length / this.state.maxPages);
    if (page >= 0 && page < numPages) {
      this.setState({currentPage: page});
    }
  },
  render: function() {
    var begin = this.state.currentPage * this.state.maxPages;
    var end = begin + this.state.maxPages;
    var numPages = Math.ceil(this.state.properties.length / this.state.maxPages);
    return (
      <div id="property-list-box">
          <div className="crumbs">
            <a className="crumb" href="#">Home</a>
            &gt;
            <a className="crumb" href="#">Rentals</a>
            &gt;
            <a className="crumb selected" href="#">San Francisco</a>
          </div>
          <div className="title">
            San Francisco Bay Area Rental Property Listings
          </div>
          <div>
            <PropertyFilter />
          </div>
          <PropertyPager total={this.state.properties.length}
                 currentPage={this.state.currentPage} numPages={numPages}
                 switchPage={this.switchPage} />
          <PropertyTable properties={this.state.properties.slice(begin, end)}
              setCoords={this.props.setCoords}/>
          <PropertyPager total={this.state.properties.length}
                 currentPage={this.state.currentPage} numPages={numPages}
                 switchPage={this.switchPage} />
      </div>
    )
  },
  componentDidMount: function () {
    var _this = this;
    axios.get("/static/data.js").then(function(result) {
      _this.setState({
        properties: result.data.hits
      });
    });
  }
});


var PropertyMap = React.createClass({
  render: function () {
    return (
      <div id="gmap" ref="map">I should be a map!</div>
    );
  },
  componentWillReceiveProps: function() {
    var location = {lat: this.props.lat, lng: this.props.lng};
    this.map.panTo(location);

     var marker = new google.maps.Marker({
      position: location,
      map: this.map,
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
  getInitialState: function () {
    return {
        lat: 48.858608,
        lng: 2.294471
    }
  },
  setCoords: function (e) {
    var elem = $(e.target).closest('.property-row');
    this.setState({lat: elem.data('lat'), lng:elem.data('lng')});
  },
  render: function() {
    return (
    <div>
      <div id="header">
        <div className="logo" />
        <ul>
          <li><a href="#">Browse</a></li>
          <li><a href="#">List Your Rental</a></li>
          <li><a href="#">Renters</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      <div id="wrapper-main">
        <PropertyList setCoords={this.setCoords} />
        <PropertyMap lat={this.state.lat} lng={this.state.lng} />
     </div>
    </div>);
  }
});



ReactDOM.render(
  <Wrapper />,
  document.getElementById('main')
);

