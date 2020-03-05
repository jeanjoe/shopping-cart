<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <title>SHOPPER 20</title>
  </head>
  <body style="background:#dfe6e9;">
    <nav class="navbar navbar-expand-lg navbar-light text-white" style="background: #00b894; color: #fff;">
        <div class="container">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand text-white" href="/">SHOPPER 20</a>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                </ul>
                <div class="my-2 my-lg-0">
                    <div class="dropdown d-inline mr-2">
                        <button class="btn btn-primary" type="button" id="cartDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        </button>

                        <div class="dropdown-menu dropdown-menu-right mt-3" aria-labelledby="cartDropdownMenuLink">
                            <div class="text-center text-primary font-weight-bold">Items in cart</div>
                            <div class="dropdown-divider"></div>
                            <ul class="list-group" id="my_cart_items">
                            </ul>
                            <div class="dropdown-divider"></div>
                            <div class="px-2">
                                <button class="btn btn-sm btn-outline-danger mr-2 float-left" onClick="clearCart()">Clear</button>
                                <button class="btn btn-sm btn-outline-success float-right" type="button"  data-toggle="modal" data-target="#cartModal">Checkout</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </nav>  

    <div class="container my-4">
        <h3>Product List</h3>

        <hr>

        <div id="loader"></div>
        <!-- Dispaly Products here -->
        <div class="row" id="products"> </div>

        <div class="text-sm text-center text-muted my-4">
            &copy; <?= Date('Y') ?> manzede - SHOPPER 20. All Rights Reserved
        </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="cartModal" tabindex="-1" role="dialog" aria-labelledby="cartModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="cartModalLabel">My Cart - Checkout</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Pay Now</button>
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