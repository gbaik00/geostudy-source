import React from 'react';
import { Button, Item, Rating } from 'semantic-ui-react';
import Tag from '/imports/ui/components/Tag';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { withRouter, Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Tags } from '../../api/tag/Tags';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Spot extends React.Component {
  render() {
    return (
        <Item>
          <Item.Image src={this.props.spot.image}/>

          <Item.Content>
            <Item.Header as='h3'><p className='spots-text'>{this.props.spot.name}</p></Item.Header>
            <Item.Meta><p className='spots-subtext'>{this.props.spot.location}</p></Item.Meta>
            <Item.Description>
              <p className='spots-text'>
                {this.props.spot.description}
              </p>
            </Item.Description>
            <Item.Extra>
              <div className='spots-text'>
                Tags: &nbsp; <Tag Tags={Tags} tags={this.props.tags}/>
              </div>
            </Item.Extra>
            <Item.Extra>
              <div className='spots-text'> Rating:
                &nbsp; <Rating icon='star' maxRating={5} rating={this.getRating(this.props.spot.name)} disabled/> &nbsp;
                (Total: {this.getRatingCount(this.props.Ratings.find({ spot: this.props.spot.name }).count())})
              </div>
            </Item.Extra>
            {Roles.userIsInRole(Meteor.userId(), 'admin') || (Meteor.user().username === this.props.spot.owner) ? (
                <Item.Extra>
                  <Link to={`/edit/${this.props.spot._id}`} className='spots-test'>Edit</Link>
                </Item.Extra>
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
                <Item.Extra>
                  <Button className="ui button"
                          onClick={() => this.removeItem(this.props.spot._id)}>Delete</Button>
                </Item.Extra>
            ) : ''}
          </Item.Content>
        </Item>
    );
  }

  removeItem(spotId) {
    this.props.Spots.remove(spotId);
  }

  getRating(nameGet) {
    const infoGet = _.pluck(this.props.Ratings.find({ spot: nameGet }).fetch(), 'score');
    if (infoGet === undefined || infoGet.length === 0) {
      return '0';
    }
    const infoReduce = _.reduce(infoGet, (memo, num) => memo + num);
    const infoLength = (infoGet.length - 1);
    return (infoReduce / infoLength);
  }

  getRatingCount(number) {
    if (number <= 0) {
      return 0;
    }
    return number - 1;
  }
}

/** Require a document to be passed to this component. */
Spot.propTypes = {
  Spots: PropTypes.object.isRequired,
  spot: PropTypes.object.isRequired,
  Ratings: PropTypes.object.isRequired,
  rating: PropTypes.array.isRequired,
  Tags: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  currentUser: PropTypes.string,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Spot);
