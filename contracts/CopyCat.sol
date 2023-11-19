 SPDX-License-Identifier MIT
pragma solidity ^0.8.7;
pragma abicoder v2;

import @uniswapv3-peripherycontractslibrariesTransferHelper.sol;
import @uniswapv3-peripherycontractsinterfacesISwapRouter.sol;

contract CopyCat {
    address manager;
    address owner;
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    constructor(address _manager) {
        owner = msg.sender;
        manager = _manager;
    }

    function changeOwner(address _owner) external {
        require(msg.sender == owner, You have no access);
        owner = _owner;
    }

    function setManager(address _manager) external {
        require(msg.sender == owner, You have no access);
        manager = _manager;
    }

     @notice Swaps a fixed amount of WETH for a maximum possible amount of _tokenOut
    function swapExactInputSingle(
        address _client, 
        address _tokenIn, 
        address _tokenOut, 
        uint256 _amountIn,
        uint160 _sqrtPriceLimitX96
    )

        external
        returns (uint amountOut)
    {
        require(msg.sender == manager, You have no access);
        TransferHelper.safeTransferFrom(
            _tokenIn,
            _client,
            address(this),
            _amountIn
        );
        TransferHelper.safeApprove(_tokenIn, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn _tokenIn,
            tokenOut _tokenOut,
             pool fee 0.3%
            fee 3000,
            recipient _client,
            deadline block.timestamp,
            amountIn _amountIn,
            amountOutMinimum 0,
             NOTE In production, this value can be used to set the limit
             for the price the swap will push the pool to,
             which can help protect against price impact
            sqrtPriceLimitX96 _sqrtPriceLimitX96
        });
        amountOut = swapRouter.exactInputSingle(params);
    }
}