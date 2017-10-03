/**
 * Create new RxBlock
 * @param {blockmaniac.bitrx.addRxBlock} addRxBlock transaction
  * @transaction
 */
function addRxBlock(addRxBlock){
    return getAssetRegistry('blockmaniac.bitrx.RxBlock')
        .then(function(rxBlockRegistry){        
            return rxBlockRegistry.add(addRxBlock.rxBlock);
        });
  }
  
  /**
   * Prescribe medicine
   * @param {blockmaniac.bitrx.prescribeMedicine} prescribeMedicine transaction
    * @transaction
   */
  function prescribeMedicine(prescribeMedicine){
      
        var theBlock = prescribeMedicine.rxBlock;
          var prescriptions = prescribeMedicine.prescriptions;
      
          if(!theBlock.prescriptions)
          theBlock.prescriptions = [];
      
          theBlock.prescriptions.push.apply(theBlock.prescriptions, prescriptions);
          
    
        return getAssetRegistry('blockmaniac.bitrx.RxBlock')
        .then(function(rxBlockRegistry){        
            return rxBlockRegistry.update(theBlock);
        });
    }
  
  