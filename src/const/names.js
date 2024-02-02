const names = [
    't', 'e', 'i', 'r', 'o', 'h', 'l', 'd', 'c', 's', 'u',
    'y', 'p', 'm', 'n', 'a', 'b', 'k', 'v', 'w', 'x',
    'z', 'f', 'j', 'g', 'q',

    '_t', '_e', '_i', '_r', '_o', '_h', '_l', '_d', '_c', '_s', '_u',
    '_y', '_p', '_m', '_n', '_a', '_b', '_k', '_v', '_w', '_x',
    '_z', '_f', '_j', '_g', '_q',

    'tk', 'eo', 'ik', 'ro', 'oo', 'ho', 'lo', 'dk', 'co', 'sk',
    'yo', 'po', 'mo', 'no', 'ao', 'bo', 'ko', 'vo', 'wo', 'xo',
    'zo', 'fo', 'jo', 'gk', 'qo',

    '_tk', '_eo', '_ik', '_ro', '_oo', '_ho', '_lo', '_dk', '_co', '_sk',
    '_yo', '_po', '_mo', '_no', '_ao', '_bo', '_ko', '_vo', '_wo', '_xo',
    '_zo', '_fo', '_jo', '_gk', '_qo',

    'tw', 'ew', 'iw', 'rw', 'ow', 'hw', 'lw', 'dw', 'cw', 'sw',
    'yw', 'pw', 'mw', 'nw', 'aw', 'bw', 'kw', 'vw', 'ww', 'xw',
    'zw', 'fw', 'jw', 'gw', 'qw',

    '_tw', '_ew', '_iw', '_rw', '_ow', '_hw', '_lw', '_dw', '_cw', '_sw',
    '_yw', '_pw', '_mw', '_nw', '_aw', '_bw', '_kw', '_vw', '_ww', '_xw',
    '_zw', '_fw', '_jw', '_gw', '_qw',

    'tx', 'ex', 'ix', 'rx', 'ox', 'hx', 'lx', 'dx', 'cx', 'sx',
    'yx', 'px', 'mx', 'nx', 'ax', 'bx', 'kx', 'vx', 'wx', 'xx',
    'zx', 'fx', 'jx', 'gx', 'qx',

    '_tx', '_ex', '_ix', '_rx', '_ox', '_hx', '_lx', '_dx', '_cx', '_sx',
    '_yx', '_px', '_mx', '_nx', '_ax', '_bx', '_kx', '_vx', '_wx', '_xx',
    '_zx', '_fx', '_jx', '_gx', '_qx',


    'ty', 'ey', 'iy', 'ry', 'oy', 'hy', 'ly', 'dy', 'cy', 'sy',
    'yy', 'py', 'my', 'ny', 'ay', 'by', 'ky', 'vy', 'wy', 'xy',
    'zy', 'fy', 'jy', 'gy', 'qy',

    '_ty', '_ey', '_iy', '_ry', '_oy', '_hy', '_ly', '_dy', '_cy', '_sy',
    '_yy', '_py', '_my', '_ny', '_ay', '_by', '_ky', '_vy', '_wy', '_xy',
    '_zy', '_fy', '_jy', '_gy', '_qy',

    'tz', 'ez', 'iz', 'rz', 'oz', 'hz', 'lz', 'dz', 'cz', 'sz',
    'yz', 'pz', 'mz', 'nz', 'az', 'bz', 'kz', 'vz', 'wz', 'xz',
    'zz', 'fz', 'jz', 'gz', 'qz',

    '_tz', '_ez', '_iz', '_rz', '_oz', '_hz', '_lz', '_dz', '_cz', '_sz',
    '_yz', '_pz', '_mz', '_nz', '_az', '_bz', '_kz', '_vz', '_wz', '_xz',
    '_zz', '_fz', '_jz', '_gz', '_qz',

    'T', 'E', 'I', 'R', 'O', 'H', 'L', 'D', 'C', 'S', 'U', 'Y', 'P', 'M', 'N',
    'A', 'B', 'K', 'V', 'W', 'X', 'Z', 'F', 'J', 'G', 'Q',

    '_T', '_E', '_I', '_R', '_O', '_H',
    '_L', '_D', '_C', '_S', '_U', '_Y', '_P', '_M', '_N',
    '_A', '_B', '_K', '_V', '_W', '_X', '_Z', '_F', '_J', '_G', '_Q',

    'Tk', 'Eo', 'Ik', 'Ro', 'Oo', 'Ho',
    'Lo', 'Dk', 'Co', 'Sk', 'Uo', 'Yo', 'Po', 'Mo', 'No', 'uo',
    'Ao', 'Bo', 'Ko', 'Vo', 'Wo', 'Xo', 'Zo', 'Fo', 'Jo', 'Gk', 'Qo',

    '_Tk', '_Eo', '_Ik', '_Ro', '_Oo', '_Ho',
    '_Lo', '_Dk', '_Co', '_Sk', '_Uo', '_Yo', '_Po', '_Mo', '_No', '_uo',
    '_Ao', '_Bo', '_Ko', '_Vo', '_Wo', '_Xo', '_Zo', '_Fo', '_Jo', '_Gk', '_Qo',

    'Tw', 'Ew', 'Iw', 'Rw', 'Ow', 'Hw',
    'Lw', 'Dw', 'Cw', 'Sw', 'Uw', 'Yw', 'Pw', 'Mw', 'Nw', 'uw',
    'Aw', 'Bw', 'Kw', 'Vw', 'Ww', 'Xw', 'Zw', 'Fw', 'Jw', 'Gw', 'Qw',

    '_Tw', '_Ew', '_Iw', '_Rw', '_Ow', '_Hw',
    '_Lw', '_Dw', '_Cw', '_Sw', '_Uw', '_Yw', '_Pw', '_Mw', '_Nw', '_uw',
    '_Aw', '_Bw', '_Kw', '_Vw', '_Ww', '_Xw', '_Zw', '_Fw', '_Jw', '_Gw', '_Qw',

    'Tx', 'Ex', 'Ix', 'Rx', 'Ox', 'Hx',
    'Lx', 'Dx', 'Cx', 'Sx', 'Ux', 'Yx', 'Px', 'Mx', 'Nx', 'ux',
    'Ax', 'Bx', 'Kx', 'Vx', 'Wx', 'Xx', 'Zx', 'Fx', 'Jx', 'Gx', 'Qx',

    '_Tx', '_Ex', '_Ix', '_Rx', '_Ox', '_Hx',
    '_Lx', '_Dx', '_Cx', '_Sx', '_Ux', '_Yx', '_Px', '_Mx', '_Nx', '_ux',
    '_Ax', '_Bx', '_Kx', '_Vx', '_Wx', '_Xx', '_Zx', '_Fx', '_Jx', '_Gx', '_Qx',

    'Ty', 'Ey', 'Iy', 'Ry', 'Oy', 'Hy',
    'Ly', 'Dy', 'Cy', 'Sy', 'Uy', 'Yy', 'Py', 'My', 'Ny', 'uy',
    'Ay', 'By', 'Ky', 'Vy', 'Wy', 'Xy', 'Zy', 'Fy', 'Jy', 'Gy', 'Qy',

    '_Ty', '_Ey', '_Iy', '_Ry', '_Oy', '_Hy',
    '_Ly', '_Dy', '_Cy', '_Sy', '_Uy', '_Yy', '_Py', '_My', '_Ny', '_uy',
    '_Ay', '_By', '_Ky', '_Vy', '_Wy', '_Xy', '_Zy', '_Fy', '_Jy', '_Gy', '_Qy',

    'Tz', 'Ez', 'Iz', 'Rz', 'Oz', 'Hz',
    'Lz', 'Dz', 'Cz', 'Sz', 'Uz', 'Yz', 'Pz', 'Mz', 'Nz', 'uz',
    'Az', 'Bz', 'Kz', 'Vz', 'Wz', 'Xz', 'Zz', 'Fz', 'Jz', 'Gz', 'Qz',

    '_Tz', '_Ez', '_Iz', '_Rz', '_Oz', '_Hz',
    '_Lz', '_Dz', '_Cz', '_Sz', '_Uz', '_Yz', '_Pz', '_Mz', '_Nz', '_uz',
    '_Az', '_Bz', '_Kz', '_Vz', '_Wz', '_Xz', '_Zz', '_Fz', '_Jz', '_Gz', '_Qz',
]


module.exports = names