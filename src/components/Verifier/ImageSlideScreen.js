import React, { Component } from 'react';
import Carousel from 'react-native-smart-carousel';
import { connect } from 'react-redux';
import { Text } from 'native-base';

class ImageSlideScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productImages: this.props.productDetails
        }
    }
    render() {
        return (
            <Carousel
                data={this.state.productImages}
                autoPlay={true}
                playTime={5000}
                navigation={true}
                navigationType={'dots'}
                navigationColor={'#f4b826'}
                height={200}
            />

        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps, null)(ImageSlideScreen)