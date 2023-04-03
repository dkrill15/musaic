var data = [
      { name: 'Matthew', sex: 'male' },
      { name: 'Amanda', sex: 'female' }
];

var FilterForm = React.createClass({
      getInitialState: function() {
        return {
          sex: ''
        }
      },
      handleChange: function(val) {
        this.setState({sex: val});
        console.log(val);
      },
      render: function() {
        // create list of options from input data (based on sex)
        var optionsArray=this.props.data.map((item) => { return item.sex });
        optionsArray.unshift("");
        return (
          <div className="filter-form">
            <h1>Filter Form</h1>
            <FilterOptions options={optionsArray} selected={this.state.sex} changeOption={this.handleChange} />
            <FilterItems data={this.props.data} filter={this.state.sex} />
          </div>
        );
      }
    });

var FilterOptions = React.createClass({
      handleChange: function(e) {
        var val = e.target.value;
        this.props.changeOption(val);
      },
      render: function() {
        var selectedOption = this.props.selected;
        return (
          <select id="sex" value={selectedOption} onChange={this.handleChange}>
            {this.props.options.map(option => {
              return <option key={option} value={option} selected={(option.value == selectedOption)}>{option}</option>;
            })}
          </select>
        );
      }
    });

var FilterItems = React.createClass({
      render: function() {
        var filter = this.props.filter;
        var filteredData = this.props.data.filter((item) => {
          return (!filter || item.sex == filter)
        });

        return (
          <div className="filter-item">
            {filteredData.map(function(item) {
              return (
                <div>{item.name}</div>
              );
            })}
          </div>
        );
      }
    });

React.render(
      <FilterForm data={data} />,
      document.getElementById('app')
    );
