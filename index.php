<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="public/style/style.css">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <title>SHOPPER 20</title>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-light text-white" style="background: #00b894; color: #fff;">
        <div class="container">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand text-white" href="/"><i class="fa fa-shopping-basket"></i> SHOPPER 20</a>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                </ul>
                <div class="my-2 my-lg-0">
                    <div class="dropdown d-inline mr-2">
                        <button class="btn btn-primary rounded-0" type="button" id="cartDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        </button>

                        <div class="dropdown-menu dropdown-menu-right mt-3" aria-labelledby="cartDropdownMenuLink">
                            <div class="text-center text-primary font-weight-bold">Items in cart</div>
                            <ul class="list-group" id="my_cart_items"></ul>
                            <div class="p-2" id="my_cart_buttons">
                                <button class="btn btn-sm btn-outline-danger rounded-0 mr-2 float-left" onClick="clearCart()">Clear</button>
                                <button class="btn btn-sm btn-outline-success rounded-0 float-right" type="button"  data-toggle="modal" data-target="#cartModal">Checkout</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </nav>  

    <div class="container my-4">
        <h3>Products <span id="spinner"></span></h3>
        <hr>
        <!-- Dispaly Products here -->
        <div class="row" id="products"> </div>
        <footer class="text-center my-4">
            &copy; <?= Date('Y') ?> manzede - SHOPPER 20. All Rights Reserved
        </footer>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="cartModal" tabindex="-1" role="dialog" aria-labelledby="cartModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content rounded-0">
                <div class="modal-header bg-modal rounded-0 text-white">
                    <h5 class="modal-title" id="cartModalLabel">My Cart - Checkout</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert rounded-0" id="alert"></div>
                    <div id="my_cart_modal_content">
                        <table class="table table-striped table-sm table-bordered" id="my_cart_table">
                            <thead class="thead-light">
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Unit Cost</th>
                                <th>Total</th>
                                <th>Remove</th>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                        <div class="form-group">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text rounded-0">Grand Total ($)</span>
                                </div>
                                <input type="text" min="0" class="form-control rounded-0 text-right" id="total_amount" value="0" readonly />
                            </div>
                            
                            <div class="clearfix"></div>
                            <label class="d-block font-weight-bold text-sm text-primary">Select Delivery type</label>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="pick_up" value="pickUp" name="delivery_type" class="custom-control-input" onclick="addDeliveryFee()">
                                <label class="custom-control-label" for="pick_up">Pick Up $0</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="ups" value="UPS" name="delivery_type" class="custom-control-input" onclick="addDeliveryFee()">
                                <label class="custom-control-label" for="ups">UPS $5</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-danger rounded-0" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-sm btn-success rounded-0" id="checkoutButton" onclick="checkout()">Checkout</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="/public/js/custom.js"></script>
  </body>
</html>