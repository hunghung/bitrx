/**
* Create new RxBlock
* @param {blockmaniac.bitrx.addRxBlock} addRxBlock transaction
* @transaction
*/
function addRxBlock(addRxBlock){
    
        var newBlock = addRxBlock.rxBlock;
        var consumerID = newBlock.consumer.getIdentifier();
    
        return getParticipantRegistry('blockmaniac.bitrx.Consumer').then(function(consumerRegistry){
            return consumerRegistry.get(consumerID).then(function(consumer){
    
                return getAssetRegistry('blockmaniac.bitrx.RxBlock').then(function(rxBlockRegistry){
                    return rxBlockRegistry.getAll();
                })
                .then(function(assets) {
    
                    assets.forEach(function(asset){
                        if(asset.consumer.getIdentifier() == consumerID)
                        throw("Consumer already has RxBlock");
                    });
                    return getAssetRegistry('blockmaniac.bitrx.RxBlock').then(function(rxBlockRegistry){
                        return rxBlockRegistry.add(newBlock);
                    });
    
                });
    
    
    
            });
        })
    
    }
    
    /**
    * Prescribe medicine
    * @param {blockmaniac.bitrx.addPrescription} addPrescription transaction
    * @transaction
    */
    function addPrescription(addPrescription){
    
        var theBlock = addPrescription.rxBlock;
        var prescriptions = addPrescription.prescriptions;
    
        if(!prescriptions || prescriptions.length == 0){
            throw("Prescription cannot be empty");
        }
    
        if(!theBlock.prescriptions){
            theBlock.prescriptions = [];
        }
    
        prescriptions.forEach(function(pres){
            pres.state = "PRESCRIBED";
        });
    
        theBlock.prescriptions.push.apply(theBlock.prescriptions, prescriptions);
    
        return getAssetRegistry('blockmaniac.bitrx.RxBlock')
        .then(function(rxBlockRegistry){
            return rxBlockRegistry.update(theBlock);
        });
    }
    
    /*
    * fulfillPrescription - used by Pharmacy to add fulfillment infotmation to the block
    * @param {blockmaniac.bitrx.fulfillPrescription} fulfillPrescription
    * @transaction
    */
    function fulfillPrescription(fulfillPrescription){
        var theBlock = fulfillPrescription.rxBlock;
        var fulfillingDate = fulfillPrescription.fulfillingDate;
        var scriptID = fulfillPrescription.scriptID;
        var pharmacy = fulfillPrescription.pharmacy;
    
        for(var i =0, len = theBlock.prescriptions.length; i < len; i++){
            if(theBlock.prescriptions[i].scriptID == scriptID){
    
                if(theBlock.prescriptions[i].state != "PRESCRIBED" && theBlock.prescriptions[i].state != "ON_MARKET" && theBlock.prescriptions[i].state != "PHARMACY_CHOSEN"){
                    throw("Invalid Prescription State")
                }
    
                theBlock.prescriptions[i].pharmacy = pharmacy;
                theBlock.prescriptions[i].state = "FULFILLED";
                theBlock.prescriptions[i].fulfillingDate = fulfillingDate;
            }
        }
    
        return getAssetRegistry('blockmaniac.bitrx.RxBlock')
        .then(function(rxBlockRegistry){
            return rxBlockRegistry.update(theBlock);
        });
    }
    
    /*
    * fulfillPrescription - used by Pharmacy to add fulfillment infotmation to the block
    * @param {blockmaniac.bitrx.dropPrescription} dropPrescription
    * @transaction
    */
    function dropPrescription(dropPrescription){
        var theBlock = dropPrescription.rxBlock;
        var rules = dropPrescription.rules;
        var scriptID = dropPrescription.scriptID;
    
        for(var i =0, len = theBlock.prescriptions.length; i < len; i++){
            if(theBlock.prescriptions[i].scriptID == scriptID){
                if(theBlock.prescriptions[i].state != "PRESCRIBED"){
                    throw("Invalid Prescription State");
                }
    
                theBlock.prescriptions[i].state = "ON_MARKET";
                theBlock.prescriptions[i].rules = rules;
            }
        }
    
        return getAssetRegistry('blockmaniac.bitrx.RxBlock').then(function(rxBlockRegistry){
            return rxBlockRegistry.update(theBlock);
        });
    }
    
    /*
    * addPharmacy - used by Consumer to add select a Pharmacy
    * @param {blockmaniac.bitrx.addPharmacy} addPharmacy
    * @transaction
    */
    function addPharmacy(addPharmacy){
        var theBlock = addPharmacy.rxBlock;
        var scriptID = addPharmacy.scriptID;
        var pharmacy = addPharmacy.pharmacy;
    
        return getParticipantRegistry('blockmaniac.bitrx.Pharmacy')
        .then(function (participantRegistry) {
            return participantRegistry.get(pharmacy.getIdentifier());
        })
        .then(function(p) {
            return getAssetRegistry('blockmaniac.bitrx.RxBlock').then(function(rxBlockRegistry){
                return rxBlockRegistry.get(theBlock.getIdentifier())
                .then(function(rxBlock){
                    for(var i = 0, len = theBlock.prescriptions.length; i < len; i++){
                        if(theBlock.prescriptions[i].scriptID == scriptID){
                            if(theBlock.prescriptions[i].state != "PRESCRIBED" && theBlock.prescriptions[i].state != "ON_MARKET"){
                                throw("Invalid Prescription State");
                            }
                            theBlock.prescriptions[i].state = "PHARMACY_CHOSEN";
                            theBlock.prescriptions[i].pharmacy = pharmacy;
                            return rxBlockRegistry.update(theBlock)
                        }
                    }
                });
            });
        })
        .catch(function(error){
            throw("Invalid PharmacyID");
        });
    }
    