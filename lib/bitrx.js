function prescribeMedicine(rxBlock, prescriptions){
    prescriptions.push.apply(rxBlock.prescriptions, prescriptions);
    
    return getAssetRegistry('blockmaniac.bitrx.RxBlock')
    .then(function(rxBlockRegistry){
        //save the childform
        return rxBlockRegistry.update(rxBlock);
    });
}