import * as React from 'react'
import { RootTabScreenProps } from '../../types'
import StepTemplate from './StepTemplate'
import explorerImage from '../../assets/images/exploreeveryday.png'

export default function SecondStepScreen({ navigation }: RootTabScreenProps<'Step2'>) {
    return <StepTemplate
            navigation={navigation}
            navigationTarget="Step3"
            title="Venture out your door to collect NFTs"
            subtitle="Enjoy a quick stroll through the neighbourhood"
            image={explorerImage} />
}
