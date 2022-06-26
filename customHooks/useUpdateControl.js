
import React, {useState} from 'react';

export const useUpdateControl = (initialControls) => {
    const [controls, setControls] = useState(initialControls);

    function updateSingleControl(index, newValue) {

        let newArr = [...controls];
        newArr[index] = newValue;
        setControls(newArr);
    }

    function removeControl( selectedIndex) {
        const newControls = controls.filter((_, index) => index !== selectedIndex)
        setControls([...newControls]);
    }


    function createControl() {
        let newArr = [...controls, { colour: "#ffffff" }];
        setControls(newArr);
    }

    return {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
        createControl
    }

}

