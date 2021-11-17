<?php

# Determines whether the given value is considered "empty" or "not empty".

# $areEmpty is an array of (additional) values which WILL be considered empty
# $notEmpty is an array of values which will NOT be considered empty

function isEmpty($value, $areEmpty = [], $notEmpty = []){
  
  # Default list of values which are considered empty.
  $emptyValuesList = [
    '',
    NULL,
    [],
    false
  ];
  
  // ----------
  
  # Include additional values which WILL be considered empty.
  foreach($areEmpty as $addedValue){
    # If the third parameter strict is set to TRUE then the in_array() function will also check the types of the needle in the haystack.
    if(!in_array($addedValue, $emptyValuesList, true)){
      $emptyValuesList[] = $addedValue;
    }
  }
  
  // ----------
  
  # Exclude values which will NOT be considered empty.
  foreach($notEmpty as $removedValue){
    
    # array_keys should return an array with only a single value (key) here, as the values in $emptyValuesList
    # are unique. But we use a foreach() anyway, as a more complete solution.
    
    # Get the numeric index ($key) which contains the given value ($removedValue)
    # and unset the corresponding entry.
    
    # If the third parameter strict is set to TRUE then strict comparison (===) should be used during the search.
    foreach(array_keys($emptyValuesList, $removedValue, true) as $key){
      unset($emptyValuesList[$key]);
    }
  }
  
  // ----------
  
  # Return result.
  foreach($emptyValuesList as $empty){
    if($value === $empty){
      return true; // value IS EMPTY
    }
  }
  
  return false; // value is NOT EMPTY
  
}

?>